// src/api/controllers/cake.controller.js
const cakeService = require("../services/cake.service");

const getAll = async (req, res, next) => {
  try {
    const result = await cakeService.getAll(req.query);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const cake = await cakeService.getById(req.params.id);
    res.status(200).json({ data: cake });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newCake = await cakeService.create(req.body);
    res.status(201).json({
      message: "Tạo bánh thành công!",
      data: newCake,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedCake = await cakeService.update(req.params.id, req.body);
    res.status(200).json({
      message: "Cập nhật bánh thành công!",
      data: updatedCake,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await cakeService.remove(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getFeatured = async (req, res, next) => {
  try {
    const featuredCakes = await cakeService.getFeatured();
    res.status(200).json({ data: featuredCakes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getFeatured,
};
