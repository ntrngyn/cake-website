// src/api/services/user.service.js

const db = require("../models");
const bcrypt = require("bcryptjs");

// === Cho người dùng tự quản lý profile ===

// Lấy thông tin profile của người dùng hiện tại
const getMyProfile = async (userId, userRole) => {
  let user;
  let finalUserObject;

  if (userRole === "KhachHang") {
    user = await db.KhachHang.findByPk(userId);
    if (!user) throw new Error("Người dùng không tồn tại.");

    const { matkhauKH, ...rest } = user.get({ plain: true });
    finalUserObject = { ...rest, role: "KhachHang" };
  } else {
    user = await db.NhanVien.findByPk(userId);
    if (!user) throw new Error("Người dùng không tồn tại.");

    const { matkhauNV, chucvuNV, ...rest } = user.get({ plain: true });
    finalUserObject = { ...rest, role: chucvuNV };
  }

  return finalUserObject;
};

// Cập nhật thông tin profile của người dùng hiện tại
const updateMyProfile = async (userId, userRole, data) => {
  // Không cho phép cập nhật vai trò hoặc mật khẩu qua API này
  const { chucvuNV, matkhauKH, matkhauNV, ...updateData } = data;

  let userToUpdate;

  // 1. Tìm đúng instance Sequelize dựa trên vai trò
  if (userRole === "KhachHang") {
    userToUpdate = await db.KhachHang.findByPk(userId);
  } else {
    // Các vai trò khác được xem là Nhân viên
    userToUpdate = await db.NhanVien.findByPk(userId);
  }

  // 2. Kiểm tra nếu không tìm thấy người dùng
  if (!userToUpdate) {
    // Có thể bạn muốn dùng ApiError ở đây
    throw new Error("Người dùng không tồn tại.");
  }

  // 3. Thực hiện cập nhật trên instance Sequelize
  // Bây giờ userToUpdate chắc chắn có phương thức .update()
  await userToUpdate.update(updateData);

  // 4. Trả về người dùng đã được cập nhật (đã bỏ mật khẩu)
  // Bạn có thể gọi lại getMyProfile ở đây nếu muốn trả về dữ liệu đã được xử lý
  const updatedProfile = await getMyProfile(userId, userRole);
  return updatedProfile;
};

// === Cho Admin quản lý ===

// Quản lý Khách Hàng
const getAllCustomers = async () => {
  return await db.KhachHang.findAll({ attributes: { exclude: ["matkhauKH"] } });
};

const getCustomerById = async (id) => {
  const customer = await db.KhachHang.findByPk(id, {
    attributes: { exclude: ["matkhauKH"] },
  });
  if (!customer) throw new Error("Khách hàng không tồn tại.");
  return customer;
};

const updateCustomer = async (id, data) => {
  const customer = await getCustomerById(id);
  await customer.update(data);
  return customer;
};

const deleteCustomer = async (id) => {
  const customer = await getCustomerById(id); // Dùng lại hàm có sẵn để kiểm tra tồn tại
  await customer.destroy(); // Phương thức xóa của Sequelize
  return { message: "Xóa khách hàng thành công." };
};

// Quản lý Nhân Viên
const getAllEmployees = async () => {
  return await db.NhanVien.findAll({ attributes: { exclude: ["matkhauNV"] } });
};

const getEmployeeById = async (id) => {
  const employee = await db.NhanVien.findByPk(id, {
    attributes: { exclude: ["matkhauNV"] },
  });
  if (!employee) throw new Error("Nhân viên không tồn tại.");
  return employee;
};

const createEmployee = async (data) => {
  const existingEmployee = await db.NhanVien.findOne({
    where: { emailNV: data.emailNV },
  });
  if (existingEmployee) throw new Error("Email đã tồn tại.");

  const hashedPassword = await bcrypt.hash(data.matkhauNV, 10);
  const newEmployee = await db.NhanVien.create({
    ...data,
    matkhauNV: hashedPassword,
  });

  const { matkhauNV, ...employeeWithoutPassword } = newEmployee.get({
    plain: true,
  });
  return employeeWithoutPassword;
};

const updateEmployee = async (id, data) => {
  const employee = await getEmployeeById(id);
  // Nếu có mật khẩu mới trong data, hash nó trước khi cập nhật
  if (data.matkhauNV) {
    data.matkhauNV = await bcrypt.hash(data.matkhauNV, 10);
  }
  await employee.update(data);
  return employee;
};

const deleteEmployee = async (id) => {
  const employee = await getEmployeeById(id); // Dùng lại hàm có sẵn
  await employee.destroy();
  return { message: "Xóa nhân viên thành công." };
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteCustomer,
  deleteEmployee,
};
