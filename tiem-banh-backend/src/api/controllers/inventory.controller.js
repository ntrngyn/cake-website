// src/api/controllers/inventory.controller.js

const inventoryService = require("../services/inventory.service");

const createStockIn = async (req, res, next) => {
  try {
    // idNV sẽ được lấy từ token của người dùng đang đăng nhập
    const idNV = req.user.id;
    const data = { ...req.body, idNV };

    const newStockIn = await inventoryService.createStockIn(data);
    res.status(201).json({
      message: "Tạo phiếu nhập kho thành công!",
      data: newStockIn,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStockIn = async (req, res, next) => {
  try {
    const stockIns = await inventoryService.getAllStockIn();
    res.status(200).json({
      message: "Lấy lịch sử nhập kho thành công!",
      data: stockIns,
    });
  } catch (error) {
    next(error);
  }
};

const getStockInById = async (req, res, next) => {
  try {
    const stockIn = await inventoryService.getStockInById(req.params.id);
    res.status(200).json({
      message: "Lấy chi tiết phiếu nhập thành công!",
      data: stockIn,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStockIn,
  getAllStockIn,
  getStockInById,
};
