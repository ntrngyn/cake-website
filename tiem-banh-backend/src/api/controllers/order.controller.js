// src/api/controllers/order.controller.js

const orderService = require("../services/order.service");

const createOrder = async (req, res, next) => {
  try {
    const idKH = req.user.id; // Lấy id của khách hàng từ token
    const data = { ...req.body, idKH };
    const newOrder = await orderService.createOrder(data);
    res.status(201).json({
      message: "Đặt hàng thành công! Đơn hàng của bạn đang chờ xử lý.",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { idDH } = req.params;
    const { idTTDH } = req.body;
    const idNV = req.user.id; // Lấy id nhân viên xử lý từ token
    const updatedOrder = await orderService.updateOrderStatus(
      idDH,
      idTTDH,
      idNV
    );
    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const idKH = req.user.id;
    const orders = await orderService.getMyOrders(idKH);
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { idDH } = req.params;
    const order = await orderService.getOrderById(idDH);
    // Kiểm tra quyền truy cập: hoặc là chủ đơn hàng, hoặc là nhân viên
    if (req.user.role !== "KhachHang" || req.user.id === order.idKH) {
      res.status(200).json({ data: order });
    } else {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem đơn hàng này." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  getMyOrders,
  getAllOrders,
  getOrderById,
};
