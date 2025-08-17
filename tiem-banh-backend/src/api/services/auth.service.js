// src/api/services/auth.service.js

const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../../utils/ApiError");

// Đăng ký tài khoản cho Khách Hàng (Cần cập nhật để dùng email làm định danh chính)
const register = async (userData) => {
  const existingUser = await db.KhachHang.findOne({
    where: { emailKH: userData.emailKH }, // Chỉ cần kiểm tra email
  });

  if (existingUser) {
    throw new ApiError(409, "Email đã tồn tại.");
  }

  const hashedPassword = await bcrypt.hash(userData.matkhauKH, 10);

  // Bỏ taikhoanKH nếu bạn quyết định loại bỏ hoàn toàn
  const newUser = await db.KhachHang.create({
    ...userData,
    matkhauKH: hashedPassword,
  });

  const { matkhauKH, ...userWithoutPassword } = newUser.get({ plain: true });
  return userWithoutPassword;
};

// === HÀM ĐĂNG NHẬP ĐÃ ĐƯỢC THỐNG NHẤT SỬ DỤNG EMAIL ===
const login = async (loginData) => {
  // Lấy ra 'taikhoan' (chứa email) và 'matkhau' từ dữ liệu gửi lên
  const { taikhoan, matkhau } = loginData;

  // Bước 1: Ưu tiên tìm trong bảng Nhân Viên trước bằng email
  // Sequelize sẽ thực hiện: SELECT * FROM NHANVIEN WHERE emailNV = 'giá trị của taikhoan'
  let user = await db.NhanVien.findOne({ where: { emailNV: taikhoan } });
  let userType = "NhanVien";

  // Bước 2: Nếu không phải là nhân viên, tìm trong bảng Khách Hàng bằng email
  if (!user) {
    user = await db.KhachHang.findOne({ where: { emailKH: taikhoan } });
    userType = "KhachHang";
  }

  // Bước 3: Nếu không tìm thấy ở đâu cả, báo lỗi
  if (!user) {
    throw new ApiError(404, "Email không tồn tại.");
  }

  // Bước 4: So sánh mật khẩu
  const passwordDB = userType === "KhachHang" ? user.matkhauKH : user.matkhauNV;
  const isPasswordMatch = await bcrypt.compare(matkhau, passwordDB);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Mật khẩu không chính xác.");
  }

  // Bước 5: Tạo payload và token
  let payload;
  if (userType === "KhachHang") {
    payload = { id: user.idKH, role: "KhachHang", email: user.emailKH };
  } else {
    payload = { id: user.idNV, role: user.chucvuNV, email: user.emailNV };
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  // Bước 6: Chuẩn hóa đối tượng user trả về cho frontend
  const userObject = user.get({ plain: true });
  let finalUserObject;

  if (userType === "NhanVien") {
    const { matkhauNV, chucvuNV, ...restOfEmployee } = userObject;
    finalUserObject = { ...restOfEmployee, role: chucvuNV };
  } else {
    // KhachHang
    const { matkhauKH, ...restOfCustomer } = userObject;
    finalUserObject = { ...restOfCustomer, role: "KhachHang" };
  }

  return { user: finalUserObject, token };
};

module.exports = {
  register,
  login,
};
