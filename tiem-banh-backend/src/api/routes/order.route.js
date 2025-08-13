// src/api/routes/order.route.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

const customerRole = ["KhachHang"];
const employeeRoles = [
  "Admin",
  "Quản lý",
  "Nhân viên bán hàng",
  "Thợ làm bánh",
];

// POST /api/orders - Khách hàng tạo đơn hàng
router.post(
  "/",
  verifyToken,
  authorize(customerRole),
  orderController.createOrder
);

// GET /api/orders/my-orders - Khách hàng xem lịch sử đơn hàng của mình
router.get(
  "/my-orders",
  verifyToken,
  authorize(customerRole),
  orderController.getMyOrders
);

// GET /api/orders - Nhân viên/Admin xem tất cả đơn hàng
router.get(
  "/",
  verifyToken,
  authorize(employeeRoles),
  orderController.getAllOrders
);

// GET /api/orders/:idDH - Xem chi tiết một đơn hàng (Cả KH và NV)
router.get("/:idDH", verifyToken, orderController.getOrderById);

// PUT /api/orders/:idDH/status - Nhân viên/Admin cập nhật trạng thái đơn hàng
router.put(
  "/:idDH/status",
  verifyToken,
  authorize(employeeRoles),
  orderController.updateOrderStatus
);

module.exports = router;
