// src/api/routes/status.route.js
const express = require("express");
const router = express.Router();
const statusController = require("../controllers/status.controller.js");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

// --- SỬA LẠI TÊN CÁC VAI TRÒ Ở ĐÂY ---
const employeeRoles = [
  "Admin",
  "Quản lý",
  "Quản lý kho",
  "NhanVien",
  "Thợ làm bánh",
];

// Định nghĩa endpoint GET /
router.get(
  "/",
  verifyToken,
  authorize(employeeRoles), // <-- Bây giờ sẽ hoạt động cho NhanVien
  statusController.getAll
);

module.exports = router;
