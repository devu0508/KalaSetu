import rateLimit from "express-rate-limit";

/**
 * Strict limiter for signup — 10 attempts per 15-minute window per IP.
 * Applied only to POST /auth/signup.
 */
export const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: "Too many sign-up attempts. Please try again in 15 minutes.",
  },
});

/**
 * Moderate limiter for signin — 30 attempts per 15-minute window per IP.
 * Applied only to POST /auth/signin.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: "Too many sign-in attempts. Please try again later.",
  },
});

/**
 * General API rate limiter.
 * 2000 requests per 1-minute window per IP (permissive for local dev).
 */
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute — resets quickly during dev
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: "Too many requests. Please try again later.",
  },
});
