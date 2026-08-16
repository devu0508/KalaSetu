import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as authService from "../services/auth.service.js";
import env from "../config/env.js";
import passport from "../config/passport.js";
import type { AuthenticatedRequest, IUser } from "../types/index.js";

/**
 * POST /api/auth/signup
 */
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const { name, email, password, role } = req.body;
  const user = await authService.signup({ name, email, password, role });

  res
    .status(201)
    .json(new ApiResponse(201, user.toJSON(), "Account created successfully"));
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
 * Redirects to Google consent screen.
 * Accepts optional ?role=customer|artisan query param, stored in a short-lived
 * cookie so it survives the OAuth redirect round-trip without needing sessions.
 */
export const googleAuth = (req: Request, res: Response, next: Function) => {
  const role = req.query.role as string || "customer";

  // Store role in a short-lived cookie (5 min) — read back in the callback
  res.cookie("oauth_role", role, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 1000, // 5 minutes
    path: "/",
  });

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    // NOTE: do NOT pass `state` here — passport-oauth2 requires express-session
    // for state CSRF verification, which we don't use.
  })(req, res, next);
};

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback, issues JWT cookies, redirects to frontend.
 */
export const googleCallback = [
  (req: Request, res: Response, next: Function) => {
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${env.frontendOrigin}/auth?error=google_failed`,
    })(req, res, next);
  },
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;

    // Read role from the cookie we set before redirecting to Google
    const role = (req.cookies?.oauth_role as string) || "customer";

    // Clear the temporary cookie
    res.clearCookie("oauth_role", { path: "/" });

    // Set role for new users (only if still default)
    if (user.role === "customer" && (role === "artisan" || role === "customer")) {
      user.role = role as "customer" | "artisan";
    }

    await authService.handleGoogleAuth({ user, res });
    res.redirect(`${env.frontendOrigin}/auth/success`);
  }),
];

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
