/**
 * Custom API error class.
 * Thrown from services/controllers and caught by the centralized error handler.
 */
class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: unknown[];

  constructor(statusCode: number, message = "Something went wrong", errors: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
