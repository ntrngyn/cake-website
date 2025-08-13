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
    // Chuyển lỗi xuống middleware xử lý lỗi tập trung
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
