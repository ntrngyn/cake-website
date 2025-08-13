// src/api/routes/status.route.js
const express = require("express");
const router = express.Router();
const statusController = require("../controllers/status.controller.js");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

// Bất kỳ nhân viên nào cũng cần xem danh sách này để cập nhật đơn hàng
const employeeRoles = [
  "Admin",
  "Quản lý",
  "Quản lý kho",
  "Nhân viên bán hàng",
  "Thợ làm bánh",
];

// Định nghĩa endpoint GET /
router.get("/", verifyToken, authorize(employeeRoles), statusController.getAll);

module.exports = router;
