// src/api/controllers/ingredient.controller.js

const ingredientService = require("../services/ingredient.service");

const getAll = async (req, res, next) => {
  try {
    const ingredients = await ingredientService.getAll(req.query);
    res.status(200).json({
      message: "Lấy danh sách nguyên liệu thành công!",
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const ingredient = await ingredientService.getById(req.params.id);
    res.status(200).json({
      message: "Lấy chi tiết nguyên liệu thành công!",
      data: ingredient,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newIngredient = await ingredientService.create(req.body);
    res.status(201).json({
      message: "Tạo nguyên liệu mới thành công!",
      data: newIngredient,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedIngredient = await ingredientService.update(
      req.params.id,
      req.body
    );
    res.status(200).json({
      message: "Cập nhật nguyên liệu thành công!",
      data: updatedIngredient,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await ingredientService.remove(req.params.id);
    res.status(200).json(result);
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
};
