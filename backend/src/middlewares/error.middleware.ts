import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

interface MongooseError extends Error {
  statusCode?: number;
  errors?: Record<string, { path: string; message: string }>;
  path?: string;
  value?: unknown;
  code?: number;
  keyValue?: Record<string, unknown>;
  success?: boolean;
}

/**
 * Centralized error handler.
 * Catches all errors thrown via next(err) or asyncHandler.
 * Returns consistent { success, data, message } shape.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (err: MongooseError, _req: Request, res: Response, _next: NextFunction): void => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: unknown[] = [];

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [];
  }

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    statusCode = 422;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
    errors = [];
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errors = [];
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errors = [];
  }

  // Always log unexpected errors
  if (statusCode >= 500 || env.nodeEnv === "development") {
    console.error("❌ Error:", {
      statusCode,
      message,
      stack: err.stack,
      errors,
    });
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(errors.length > 0 && { errors }),
  });
};

export default errorMiddleware;
