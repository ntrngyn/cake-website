// src/api/routes/auth.route.js
const express = require("express");
const router = express.Router();

// Import các thành phần cần thiết
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validator.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

// --- Định nghĩa các Routes cho Module Auth ---

// Endpoint: POST /api/auth/register
// Chức năng: Đăng ký tài khoản mới cho khách hàng
// Middleware: Kiểm tra dữ liệu đầu vào với registerSchema
router.post("/register", validate(registerSchema), authController.register);

// Endpoint: POST /api/auth/login
// Chức năng: Đăng nhập cho Khách hàng và Nhân viên
// Middleware: Kiểm tra dữ liệu đầu vào với loginSchema
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
