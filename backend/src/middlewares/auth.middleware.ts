import type { Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../services/token.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * Protect routes — verifies JWT access token from httpOnly cookie.
 * Attaches decoded user payload { id, role } to req.user.
 */
const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    throw new ApiError(401, "Authentication required. Please sign in.");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, role: decoded.role || "customer" };
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired. Please refresh.");
    }
    throw new ApiError(401, "Invalid access token");
  }
};

export default authMiddleware;
