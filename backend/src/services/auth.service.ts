import type { Request, Response } from "express";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import type { IUser } from "../types/index.js";
import {
  setTokenCookies,
  clearTokenCookies,
  verifyRefreshToken,
  generateAccessToken,
  accessCookieOptions,
} from "./token.service.js";

/**
 * Register a new user with email and password.
 */
export const signup = async ({
  name,
  email,
  password,
  role = "customer",
  res,
}: {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "artisan";
  res: Response;
}): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password, role });

  // Set auth cookies so the user is logged in immediately after signup
  const { refreshToken } = setTokenCookies(res, user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return user;
};

/**
 * Authenticate a user with email and password, set cookies.
 */
export const signin = async ({
  email,
  password,
  res,
}: {
  email: string;
  password: string;
  res: Response;
}): Promise<IUser> => {
  // select("+password") to include the password field for comparison
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.password) {
    throw new ApiError(
      401,
      "This account uses Google sign-in. Please use Google to log in."
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { refreshToken } = setTokenCookies(res, user);

  // Store refresh token in DB for rotation/revocation
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return user;
};

/**
 * Handle successful Google OAuth callback — set cookies.
 */
export const handleGoogleAuth = async ({
  user,
  res,
}: {
  user: IUser;
  res: Response;
}): Promise<IUser> => {
  const { refreshToken } = setTokenCookies(res, user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return user;
};

/**
 * Refresh the access token using the refresh token cookie.
 */
export const refresh = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<IUser> => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    throw new ApiError(401, "Refresh token not found");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, "Refresh token has been revoked");
  }

  // Issue new access token only (refresh token stays until it expires)
  const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
  res.cookie("accessToken", newAccessToken, accessCookieOptions());

  return user;
};

/**
 * Logout — clear cookies and nullify refresh token in DB.
 */
export const logout = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<void> => {
  const token = req.cookies?.refreshToken as string | undefined;

  if (token) {
    // Nullify the stored refresh token so it can't be reused
    try {
      const decoded = verifyRefreshToken(token);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch {
      // Token invalid — still clear cookies
    }
  }

  clearTokenCookies(res);
};

/**
 * Get current authenticated user.
 */
export const getMe = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
