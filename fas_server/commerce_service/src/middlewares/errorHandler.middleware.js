import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Nếu là ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      title: err.title || "Error",
      message: err.message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      status: 400,
      title: "Validation Error",
      message: errors.join(", "),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      status: 409,
      title: "Duplicate Error",
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: 400,
      title: "Invalid ID",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    title: statusCode === 500 ? "Internal Server Error" : err.title || "Error",
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
