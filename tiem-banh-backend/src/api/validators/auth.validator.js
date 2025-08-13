// src/api/validators/auth.validator.js
const Joi = require("joi");

const registerSchema = Joi.object({
  hotenKH: Joi.string().min(3).max(100).required().messages({
    "string.base": "Họ tên phải là chuỗi ký tự",
    "string.empty": "Họ tên không được để trống",
    "string.min": "Họ tên phải có ít nhất 3 ký tự",
    "any.required": "Họ tên là trường bắt buộc",
  }),
  emailKH: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là trường bắt buộc",
  }),
  taikhoanKH: Joi.string().alphanum().min(3).max(30).required(),
  matkhauKH: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là trường bắt buộc",
  }),
  // Các trường khác có thể là optional
  sdtKH: Joi.string().optional().allow(""),
  diachiKH: Joi.string().optional().allow(""),
});

const loginSchema = Joi.object({
  taikhoan: Joi.string().required(),
  matkhau: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
