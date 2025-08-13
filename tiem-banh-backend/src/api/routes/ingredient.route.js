// src/api/routes/ingredient.route.js
const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

const adminRoles = ["Admin", "Quản lý", "Quản lý kho"];

router.get(
  "/",
  verifyToken,
  authorize(adminRoles),
  ingredientController.getAll
);
router.post(
  "/",
  verifyToken,
  authorize(adminRoles),
  ingredientController.create
);
router.get(
  "/:id",
  verifyToken,
  authorize(adminRoles),
  ingredientController.getById
);
router.put(
  "/:id",
  verifyToken,
  authorize(adminRoles),
  ingredientController.update
);
router.delete(
  "/:id",
  verifyToken,
  authorize(adminRoles),
  ingredientController.remove
);

module.exports = router;
