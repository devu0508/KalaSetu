import type { Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * Artisan-only guard. Must be used AFTER authMiddleware.
 * Checks req.user.role === "artisan".
 */
const artisanMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (req.user.role !== "artisan") {
    throw new ApiError(403, "Artisan access required");
  }

  next();
};

export default artisanMiddleware;
