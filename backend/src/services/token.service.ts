import jwt from "jsonwebtoken";
import type { Response, CookieOptions } from "express";
import env from "../config/env.js";
import type { IUser, JwtPayload } from "../types/index.js";

/**
 * Generate a JWT access token (short-lived).
 */
export const generateAccessToken = (payload: { id: unknown; role: string }): string => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as any,
  });
};

/**
 * Generate a JWT refresh token (long-lived).
 */
export const generateRefreshToken = (payload: { id: unknown }): string => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as any,
  });
};

/**
 * Verify an access token.
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
};

/**
 * Verify a refresh token.
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
};

/**
 * Parse JWT_REFRESH_EXPIRES_IN string (e.g. "7d") into milliseconds
 * for cookie maxAge.
 */
const parseExpiryToMs = (expiryStr: string): number => {
  const match = expiryStr.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback: 7 days
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (multipliers[unit] || 86_400_000);
};

/**
 * Cookie options for access token.
 */
export const accessCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: parseExpiryToMs(env.jwtAccessExpiresIn),
  path: "/",
});

/**
 * Cookie options for refresh token.
 */
export const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: parseExpiryToMs(env.jwtRefreshExpiresIn),
  path: "/",
});

/**
 * Set both access and refresh token cookies on the response.
 */
export const setTokenCookies = (res: Response, user: IUser): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  res.cookie("accessToken", accessToken, accessCookieOptions());
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());

  return { accessToken, refreshToken };
};

/**
 * Clear both token cookies.
 */
export const clearTokenCookies = (res: Response): void => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
};
