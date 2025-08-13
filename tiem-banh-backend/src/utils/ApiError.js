// src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Để phân biệt lỗi có chủ đích và lỗi lập trình

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
