import type { Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * Admin-only guard. Must be used AFTER authMiddleware.
 * Checks req.user.role === "admin".
 */
const adminMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  next();
};

export default adminMiddleware;
