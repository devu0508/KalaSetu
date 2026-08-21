import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as authService from "../services/auth.service.js";
import env from "../config/env.js";
import passport from "../config/passport.js";
import type { AuthenticatedRequest, IUser } from "../types/index.js";
import User from "../models/User.js";
import {
  generateToken,
  hashToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";

/**
 * POST /api/auth/signup
 */
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const { name, email, password, role } = req.body;
  const user = await authService.signup({ name, email, password, role, res });

  // Send verification email
  const token = generateToken();
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(email, token);
  } catch (err) {
    console.error("⚠️  Failed to send verification email:", (err as Error).message);
  }

  res
    .status(201)
    .json(new ApiResponse(201, user.toJSON(), "Account created successfully. Please verify your email."));
});

/**
 * POST /api/auth/signin
 */
export const signin = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const { email, password } = req.body;
  const user = await authService.signin({ email, password, res });

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "Signed in successfully"));
});

/**
 * GET /api/auth/google
 */
export const googleAuth = (req: Request, res: Response, next: Function) => {
  const role = (req.query.role as string) || "customer";
  let returnTo = env.frontendOrigin.replace(/\/$/, "");

  if (req.headers.referer) {
    try {
      returnTo = new URL(req.headers.referer).origin;
    } catch {}
  }

  res.cookie("oauth_role", role, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  res.cookie("oauth_origin", returnTo, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

/**
 * GET /api/auth/google/callback
 */
export const googleCallback = [
  (req: Request, res: Response, next: Function) => {
    passport.authenticate("google", { session: false }, (err: any, user: any, info: any) => {
      const origin = (req.cookies?.oauth_origin as string) || env.frontendOrigin.replace(/\/$/, "");
      if (err || !user) {
        console.error("❌ Google OAuth authentication failed:", err || info);
        return res.redirect(`${origin}/auth?error=google_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;

    const role = (req.cookies?.oauth_role as string) || "customer";
    const origin = (req.cookies?.oauth_origin as string) || env.frontendOrigin.replace(/\/$/, "");
    res.clearCookie("oauth_role", { path: "/" });
    res.clearCookie("oauth_origin", { path: "/" });

    if (user.role === "customer" && (role === "artisan" || role === "customer")) {
      user.role = role as "customer" | "artisan";
    }

    // Google accounts are automatically verified
    user.isEmailVerified = true;

    const { accessToken, refreshToken } = authService.setTokenCookies(res, user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.redirect(`${origin}/auth/success?token=${accessToken}`);
  }),
];

/**
 * POST /api/auth/exchange-token
 */
export const exchangeToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const user = await authService.exchangeToken({ token, res });

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "Authentication confirmed"));
});

/**
 * POST /api/auth/refresh
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.refresh({ req, res });

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "Token refreshed successfully"));
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout({ req, res });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * GET /api/auth/me
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const user = await authService.getMe(authReq.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "User fetched successfully"));
});

/**
 * GET /api/auth/verify-email/:token
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = hashToken(req.params.token as string);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

/**
 * POST /api/auth/resend-verification
 */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) {
    // Don't reveal whether user exists
    res.status(200).json(new ApiResponse(200, null, "If an account exists, a verification email has been sent."));
    return;
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const token = generateToken();
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(email, token);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Verification email sent"));
});

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

  // Always return success to prevent email enumeration
  if (!user) {
    res.status(200).json(new ApiResponse(200, null, "If an account exists, a reset email has been sent."));
    return;
  }

  if (!user.password) {
    throw new ApiError(400, "This account uses Google sign-in. Please use Google to log in.");
  }

  const token = generateToken();
  user.passwordResetToken = hashToken(token);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail(email, token);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset email sent"));
});

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw new ApiError(400, "Token and new password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires +password");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully. Please sign in with your new password."));
});

