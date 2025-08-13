// src/api/routes/category.route.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

// Định nghĩa các vai trò được phép
const adminRoles = ["Admin", "Quản lý"];

// GET /api/categories - Mọi người đều có thể xem
router.get("/", categoryController.getAll);

// POST /api/categories - Chỉ Admin/Quản lý
router.post("/", verifyToken, authorize(adminRoles), categoryController.create);

// PUT /api/categories/:id - Chỉ Admin/Quản lý
router.put(
  "/:id",
  verifyToken,
  authorize(adminRoles),
  categoryController.update
);

// DELETE /api/categories/:id - Chỉ Admin/Quản lý
router.delete(
  "/:id",
  verifyToken,
  authorize(adminRoles),
  categoryController.remove
);

module.exports = router;
