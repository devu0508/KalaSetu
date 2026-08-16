/**
 * Consistent API response wrapper.
 * Every successful response follows: { success, data, message }
 */
class ApiResponse<T = unknown> {
  public success: boolean;
  public data: T;
  public message: string;

  constructor(statusCode: number, data: T, message = "Success") {
    this.success = statusCode < 400;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
