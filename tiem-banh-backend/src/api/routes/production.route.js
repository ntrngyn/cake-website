// src/api/routes/production.route.js

const express = require("express");
const router = express.Router();
const productionController = require("../controllers/production.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

// Các vai trò được phép thực hiện các hành động liên quan đến sản xuất
const productionRoles = ["Admin", "Quản lý", "Thợ làm bánh"];

// POST /api/production/batches - Tạo một lô sản xuất mới
router.post(
  "/batches",
  verifyToken,
  authorize(productionRoles),
  productionController.createProductionBatch
);

// GET /api/production/batches - Xem lịch sử tất cả các lô sản xuất
router.get(
  "/batches",
  verifyToken,
  authorize(productionRoles),
  productionController.getAllBatches
);

module.exports = router;
