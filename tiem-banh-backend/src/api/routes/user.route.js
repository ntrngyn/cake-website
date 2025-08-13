// src/api/routes/user.route.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

// Các vai trò quản lý
const managerRoles = ["Admin", "Quản lý"];
const adminOnly = ["Admin"];

// --- Routes cho người dùng tự quản lý ---
// GET /api/users/me - Lấy thông tin profile của chính mình
router.get("/me", verifyToken, userController.getMyProfile);
// PUT /api/users/me - Cập nhật thông tin profile của chính mình
router.put("/me", verifyToken, userController.updateMyProfile);

// --- Routes cho Admin/Quản lý quản lý Khách Hàng ---
// GET /api/users/customers
router.get(
  "/customers",
  verifyToken,
  authorize(managerRoles),
  userController.getAllCustomers
);
// GET /api/users/customers/:id
router.get(
  "/customers/:id",
  verifyToken,
  authorize(managerRoles),
  userController.getCustomerById
);
// PUT /api/users/customers/:id
router.put(
  "/customers/:id",
  verifyToken,
  authorize(managerRoles),
  userController.updateCustomer
);

// --- Routes cho Admin quản lý Nhân Viên ---
// GET /api/users/employees
router.get(
  "/employees",
  verifyToken,
  authorize(adminOnly),
  userController.getAllEmployees
);
// POST /api/users/employees - Tạo nhân viên mới
router.post(
  "/employees",
  verifyToken,
  authorize(adminOnly),
  userController.createEmployee
);
// GET /api/users/employees/:id
router.get(
  "/employees/:id",
  verifyToken,
  authorize(adminOnly),
  userController.getEmployeeById
);
// PUT /api/users/employees/:id
router.put(
  "/employees/:id",
  verifyToken,
  authorize(adminOnly),
  userController.updateEmployee
);

module.exports = router;
