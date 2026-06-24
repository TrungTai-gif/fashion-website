class ApiError extends Error {
  constructor(statusCode, message, title = "Error") {
    super(message);
    this.statusCode = statusCode;
    this.title = title;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
