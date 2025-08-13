// src/api/middlewares/validator.middleware.js
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // Hiển thị tất cả các lỗi thay vì chỉ lỗi đầu tiên
    allowUnknown: true, // Cho phép các trường không được định nghĩa trong schema
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    // Trả về lỗi 400 Bad Request
    return res.status(400).json({
      status: "error",
      message: `Dữ liệu không hợp lệ: ${errorMessages}`,
    });
  }

  next();
};

module.exports = validate;
