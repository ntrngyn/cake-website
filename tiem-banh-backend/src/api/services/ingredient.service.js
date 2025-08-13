// src/api/services/ingredient.service.js
const db = require("../models");
const { Op } = require("sequelize");

const getAll = async (query) => {
  const { search } = query;
  const whereCondition = {};
  if (search) {
    whereCondition.tenNL = { [Op.like]: `%${search}%` };
  }
  return await db.NguyenLieu.findAll({ where: whereCondition });
};

const getById = async (id) => {
  const ingredient = await db.NguyenLieu.findByPk(id);
  if (!ingredient) throw new Error("Nguyên liệu không tồn tại.");
  return ingredient;
};

const create = async (data) => {
  return await db.NguyenLieu.create(data);
};

const update = async (id, data) => {
  const ingredient = await getById(id); // Dùng lại hàm getById để kiểm tra tồn tại
  await ingredient.update(data);
  return ingredient;
};

const remove = async (id) => {
  const ingredient = await getById(id);
  // TODO: Kiểm tra xem nguyên liệu có đang được sử dụng trong công thức nào không
  await ingredient.destroy();
  return { message: "Xóa nguyên liệu thành công." };
};

module.exports = { getAll, getById, create, update, remove };
