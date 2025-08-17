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
  // SỬA LẠI: Dùng new Error()
  if (!ingredient) throw new Error("Nguyên liệu không tồn tại.");
  return ingredient;
};

// --- HÀM CREATE ĐÃ ĐƯỢC SỬA LỖI ---
const create = async (data) => {
  const { tenNL } = data;

  if (!tenNL) {
    throw new Error("Tên nguyên liệu là trường bắt buộc.");
  }

  const normalizedTenNL = tenNL.trim();

  // Kiểm tra xem tên nguyên liệu đã tồn tại chưa
  const existingIngredient = await db.NguyenLieu.findOne({
    where: {
      // SỬA LẠI: Dùng Op.like cho tương thích rộng
      tenNL: { [Op.like]: normalizedTenNL },
    },
  });

  if (existingIngredient) {
    // SỬA LẠI: Dùng new Error()
    throw new Error(`Nguyên liệu "${normalizedTenNL}" đã tồn tại.`);
  }

  const newIngredient = await db.NguyenLieu.create({
    ...data,
    tenNL: normalizedTenNL,
  });
  return newIngredient;
};

// --- HÀM UPDATE ĐÃ ĐƯỢC SỬA LỖI ---
const update = async (id, data) => {
  const ingredient = await getById(id);

  if (data.tenNL) {
    const normalizedTenNL = data.tenNL.trim();
    const existingIngredient = await db.NguyenLieu.findOne({
      where: {
        tenNL: { [Op.like]: normalizedTenNL },
        idNL: { [Op.ne]: id }, // id không phải là của chính nó
      },
    });

    if (existingIngredient) {
      // SỬA LẠI: Dùng new Error()
      throw new Error(`Tên nguyên liệu "${normalizedTenNL}" đã được sử dụng.`);
    }
    data.tenNL = normalizedTenNL;
  }

  await ingredient.update(data);
  return ingredient;
};

const remove = async (id) => {
  const ingredient = await getById(id);
  // TODO: Kiểm tra ràng buộc khóa ngoại
  await ingredient.destroy();
  return { message: "Xóa nguyên liệu thành công." };
};

module.exports = { getAll, getById, create, update, remove };
