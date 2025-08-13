// src/api/routes/cake.route.js
const express = require("express");
const router = express.Router();
const cakeController = require("../controllers/cake.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

const adminRoles = ["Admin", "Quản lý"];

// GET /api/cakes - Lấy danh sách bánh (public)
router.get("/", cakeController.getAll);

// Thêm route này TRƯỚC route '/:id' để tránh xung đột
router.get("/featured", cakeController.getFeatured);

// GET /api/cakes/:id - Lấy chi tiết bánh (public)
router.get("/:id", cakeController.getById);

// POST /api/cakes - Tạo bánh mới (Admin/Quản lý)
router.post("/", verifyToken, authorize(adminRoles), cakeController.create);

// PUT /api/cakes/:id - Cập nhật bánh (Admin/Quản lý)
router.put("/:id", verifyToken, authorize(adminRoles), cakeController.update);

// DELETE /api/cakes/:id - Xóa bánh (Admin/Quản lý)
router.delete(
  "/:id",
  verifyToken,
  authorize(adminRoles),
  cakeController.remove
);

module.exports = router;
