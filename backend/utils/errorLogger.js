// Custom error class
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const logError = (err, req) => {
  console.error(`[ERROR] ${new Date().toISOString()}:`, {
    message: err.message,
    stack: err.stack,
    url: req?.originalUrl,
    method: req?.method,
    ip: req?.ip,
  });
};

const createErrorResponse = (message, statusCode) => {
  return new AppError(message, statusCode);
};

// Error response utility
const errorResponse = (err, req, res) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  logError(err, req);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID';
    error = createErrorResponse(message, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value';
    error = createErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = createErrorResponse(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token, please login again';
    error = createErrorResponse(message, 401);
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired, please login again';
    error = createErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Create global error handler
const createGlobalErrorHandler = () => {
  const errorHandler = (err, req, res, next) => {
    errorResponse(err, req, res, next);
  };

  return {
    errorHandlerMiddleware: () => errorHandler,
    AppError,
    asyncHandler,
  };
};

module.exports = {
  createGlobalErrorHandler,
  errorResponse,
  asyncHandler,
  AppError,
};
