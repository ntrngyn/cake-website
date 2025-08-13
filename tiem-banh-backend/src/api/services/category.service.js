// src/api/services/category.service.js
const db = require("../models");

// Lấy tất cả loại bánh
const getAll = async () => {
  return await db.LoaiBanh.findAll();
};

// Tạo loại bánh mới
const create = async (categoryData) => {
  return await db.LoaiBanh.create(categoryData);
};

// Cập nhật loại bánh
const update = async (id, categoryData) => {
  const category = await db.LoaiBanh.findByPk(id);
  if (!category) {
    throw new Error("Loại bánh không tồn tại.");
  }
  await category.update(categoryData);
  return category;
};

// Xóa loại bánh
const remove = async (id) => {
  const category = await db.LoaiBanh.findByPk(id);
  if (!category) {
    throw new Error("Loại bánh không tồn tại.");
  }
  // TODO: Cần kiểm tra xem có Bánh nào đang thuộc loại này không trước khi xóa
  // Nếu có, có thể không cho xóa hoặc yêu cầu chuyển các Bánh đó sang loại khác
  await category.destroy();
  return { message: "Xóa loại bánh thành công." };
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
