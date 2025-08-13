// src/api/controllers/production.controller.js

const productionService = require("../services/production.service");

const createProductionBatch = async (req, res, next) => {
  try {
    // idNV của người tạo lô sản xuất cũng được lấy từ token
    const idNV = req.user.id;
    const data = { ...req.body, idNV };

    const newBatch = await productionService.createProductionBatch(data);
    res.status(201).json({
      message: "Tạo lô sản xuất thành công!",
      data: newBatch,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBatches = async (req, res, next) => {
  try {
    const batches = await productionService.getAllBatches();
    res.status(200).json({
      message: "Lấy danh sách lô sản xuất thành công!",
      data: batches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductionBatch,
  getAllBatches,
};
