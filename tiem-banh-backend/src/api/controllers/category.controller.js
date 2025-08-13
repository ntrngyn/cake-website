// src/api/controllers/category.controller.js
const categoryService = require("../services/category.service");

const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newCategory = await categoryService.create(req.body);
    res.status(201).json({
      message: "Tạo loại bánh thành công!",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedCategory = await categoryService.update(
      req.params.id,
      req.body
    );
    res.status(200).json({
      message: "Cập nhật loại bánh thành công!",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await categoryService.remove(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
