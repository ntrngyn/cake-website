// src/api/middlewares/errorHandler.middleware.js
const ApiError = require("../../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  console.error("ERROR 💥", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Lỗi từ phía máy chủ";

  // Xử lý các lỗi cụ thể từ Sequelize nếu cần
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409; // Conflict
    const field = Object.keys(err.fields)[0];
    message = `Giá trị của trường '${field}' đã tồn tại.`;
  }

  res.status(statusCode).json({
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message: message,
  });
};

module.exports = errorHandler;
