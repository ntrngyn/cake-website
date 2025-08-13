// src/api/routes/inventory.route.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

const adminRoles = ["Admin", "Quản lý", "Quản lý kho"];

router.post(
  "/stock-in",
  verifyToken,
  authorize(adminRoles),
  inventoryController.createStockIn
);
router.get(
  "/stock-in",
  verifyToken,
  authorize(adminRoles),
  inventoryController.getAllStockIn
);
router.get(
  "/stock-in/:id",
  verifyToken,
  authorize(adminRoles),
  inventoryController.getStockInById
);

module.exports = router;
