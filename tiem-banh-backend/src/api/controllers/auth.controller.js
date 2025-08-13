// src/api/controllers/auth.controller.js
const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body);
    res.status(201).json({
      message: "Đăng ký thành công!",
      data: newUser,
    });
  } catch (error) {
    // === NÂNG CẤP Ở ĐÂY ===
    // Kiểm tra xem lỗi có phải là lỗi "Email đã tồn tại" không
    if (error.message.includes("Email đã tồn tại")) {
      // Trả về lỗi 400 với thông điệp rõ ràng
      return res.status(400).json({
        message: "Email này đã được sử dụng. Vui lòng chọn một email khác.",
      });
    }
    // Chuyển các lỗi khác cho trình xử lý lỗi toàn cục
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({
      message: "Đăng nhập thành công!",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
