// src/api/services/auth.service.js

const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../../utils/ApiError");

// Đăng ký tài khoản cho Khách Hàng
const register = async (userData) => {
  const existingUser = await db.KhachHang.findOne({
    where: {
      [db.Sequelize.Op.or]: [
        { emailKH: userData.emailKH },
        { taikhoanKH: userData.taikhoanKH },
      ],
    },
  });

  if (existingUser) {
    throw new ApiError(409, "Email hoặc tài khoản đã tồn tại.");
  }

  const hashedPassword = await bcrypt.hash(userData.matkhauKH, 10);

  const newUser = await db.KhachHang.create({
    ...userData,
    matkhauKH: hashedPassword,
  });

  const { matkhauKH, ...userWithoutPassword } = newUser.get({ plain: true });
  return userWithoutPassword;
};

// Đăng nhập cho cả Khách Hàng và Nhân Viên
const login = async (loginData) => {
  const { taikhoan, matkhau } = loginData;

  let user = await db.KhachHang.findOne({ where: { taikhoanKH: taikhoan } });
  let userType = "KhachHang";

  if (!user) {
    user = await db.NhanVien.findOne({ where: { emailNV: taikhoan } });
    userType = "NhanVien";
  }

  if (!user) {
    throw new ApiError(404, "Tài khoản không tồn tại.");
  }

  const passwordDB = userType === "KhachHang" ? user.matkhauKH : user.matkhauNV;
  const isPasswordMatch = await bcrypt.compare(matkhau, passwordDB);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Mật khẩu không chính xác.");
  }

  // --- LOGIC TẠO PAYLOAD VÀ TOKEN (KHÔNG THAY ĐỔI) ---
  let payload;
  if (userType === "KhachHang") {
    payload = {
      id: user.idKH,
      role: "KhachHang",
      taikhoan: user.taikhoanKH,
    };
  } else {
    payload = {
      id: user.idNV,
      role: user.chucvuNV, // JWT payload vẫn dùng 'chucvuNV' cho chính xác
      taikhoan: user.emailNV,
    };
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  // --- LOGIC BIẾN ĐỔI DỮ LIỆU TRẢ VỀ CHO FRONTEND (ĐÃ THAY ĐỔI) ---
  const userObject = user.get({ plain: true });
  let finalUserObject;

  if (userType === "NhanVien") {
    // Nếu là nhân viên, loại bỏ mật khẩu và đổi tên 'chucvuNV' thành 'role'
    const { matkhauNV, chucvuNV, ...restOfEmployee } = userObject;
    finalUserObject = { ...restOfEmployee, role: chucvuNV };
  } else {
    // userType === 'KhachHang'
    // Nếu là khách hàng, loại bỏ mật khẩu và thêm thuộc tính 'role'
    const { matkhauKH, ...restOfCustomer } = userObject;
    finalUserObject = { ...restOfCustomer, role: "KhachHang" };
  }

  return { user: finalUserObject, token };
};

module.exports = {
  register,
  login,
};
