// src/api/controllers/user.controller.js

const userService = require("../services/user.service");

// === Controller cho người dùng tự quản lý profile ===

const getMyProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Lấy từ token đã được xác thực
    const profile = await userService.getMyProfile(id, role);
    res.status(200).json({ data: profile });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const updatedProfile = await userService.updateMyProfile(
      id,
      role,
      req.body
    );
    res.status(200).json({
      message: "Cập nhật thông tin thành công!",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

// === Controller cho Admin quản lý Khách Hàng ===

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await userService.getAllCustomers();
    res.status(200).json({ data: customers });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await userService.getCustomerById(req.params.id);
    res.status(200).json({ data: customer });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const updatedCustomer = await userService.updateCustomer(
      req.params.id,
      req.body
    );
    res.status(200).json({
      message: "Cập nhật thông tin khách hàng thành công!",
      data: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// === Controller cho Admin quản lý Nhân Viên ===

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await userService.getAllEmployees();
    res.status(200).json({ data: employees });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await userService.getEmployeeById(req.params.id);
    res.status(200).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const newEmployee = await userService.createEmployee(req.body);
    res.status(201).json({
      message: "Tạo nhân viên mới thành công!",
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const updatedEmployee = await userService.updateEmployee(
      req.params.id,
      req.body
    );
    res.status(200).json({
      message: "Cập nhật thông tin nhân viên thành công!",
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
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
};
