import type { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express route handler so thrown errors are forwarded
 * to the centralized error middleware automatically.
 * Eliminates repetitive try/catch in every controller.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
