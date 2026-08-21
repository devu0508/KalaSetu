import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signupValidator, signinValidator } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authLimiter, signupLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Public — per-route limiters
router.post("/signup", signupLimiter, signupValidator, authController.signup);
router.post("/signin", authLimiter, signinValidator, authController.signin);

// Google OAuth
router.get("/google", authController.googleAuth);
router.get("/google/callback", ...authController.googleCallback);

// Token refresh (uses cookie, no auth middleware needed)
router.post("/refresh", authController.refresh);

// Email verification
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

// Password reset
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected
router.post("/logout", authMiddleware as any, authController.logout);
router.get("/me", authMiddleware as any, authController.me);

export default router;
