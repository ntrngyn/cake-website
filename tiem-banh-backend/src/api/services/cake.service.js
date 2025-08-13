// src/api/services/cake.service.js
const { Op } = require("sequelize");
const db = require("../models");
const { sequelize } = require("../models"); // Import sequelize instance

const getAll = async (query) => {
  const { page = 1, limit = 10, search, categoryId } = query;
  const offset = (page - 1) * limit;

  const whereCondition = {};
  if (search) {
    whereCondition.tenBANH = { [Op.like]: `%${search}%` };
  }
  if (categoryId) {
    whereCondition.idLB = categoryId;
  }

  const { count, rows } = await db.Banh.findAndCountAll({
    where: whereCondition,
    // --- THÊM KHỐI CODE NÀY VÀO ---
    include: [
      {
        model: db.LoaiBanh, // "Bảo" Sequelize hãy JOIN với bảng LoaiBanh
        attributes: ["tenLOAIBANH"], // Chỉ lấy cột tenLOAIBANH
      },
    ],
    // -----------------------------
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["idBANH", "DESC"]],
  });

  // --- THÊM KHỐI CODE BIẾN ĐỔI DỮ LIỆU ---
  const transformedCakes = rows.map((cake) => {
    const plainCake = cake.get({ plain: true });
    return {
      ...plainCake,
      giaBANH: parseFloat(plainCake.giaBANH), // Chuyển đổi string thành number
    };
  });
  // ------------------------------------

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    cakes: transformedCakes, // <-- Trả về dữ liệu đã được biến đổi
  };
};

// Lấy chi tiết một sản phẩm bánh
const getById = async (id) => {
  const cake = await db.Banh.findByPk(id, {
    include: [
      {
        model: db.LoaiBanh,
        attributes: ["tenLOAIBANH"],
      },
      {
        model: db.NguyenLieu, // JOIN với bảng NguyenLieu
        through: {
          // Lấy các thuộc tính từ bảng trung gian CONGTHUC
          attributes: ["soluong", "donvi"],
        },
      },
    ],
  });
  if (!cake) {
    throw new ApiError(404, "Bánh không tồn tại.");
  }
  return cake.get({ plain: true }); // Trả về object thuần túy
};

// --- SỬA LẠI HÀM CREATE ---
const create = async (cakeData) => {
  const { tenBANH, motaBANH, giaBANH, hinhanhBANH, idLB, congthuc } = cakeData;

  if (!congthuc || congthuc.length === 0) {
    throw new ApiError(
      400,
      "Sản phẩm phải có ít nhất một nguyên liệu trong công thức."
    );
  }

  const t = await sequelize.transaction();
  try {
    // 1. Tạo bánh mới
    const newCake = await db.Banh.create(
      {
        tenBANH,
        motaBANH,
        giaBANH,
        hinhanhBANH,
        idLB,
      },
      { transaction: t }
    );

    // 2. Chuẩn bị dữ liệu công thức
    const recipeData = congthuc.map((item) => ({
      idBANH: newCake.idBANH,
      idNL: item.idNL,
      soluong: item.soluong,
      donvi: item.donvi,
    }));

    // 3. Thêm công thức vào bảng CONGTHUC
    await db.CongThuc.bulkCreate(recipeData, { transaction: t });

    await t.commit();
    return newCake;
  } catch (error) {
    await t.rollback();
    throw new ApiError(500, `Thêm sản phẩm thất bại: ${error.message}`);
  }
};

// --- SỬA LẠI HÀM UPDATE ---
const update = async (id, cakeData) => {
  const { tenBANH, motaBANH, giaBANH, hinhanhBANH, idLB, congthuc } = cakeData;
  const cake = await db.Banh.findByPk(id);
  if (!cake) {
    throw new ApiError(404, "Bánh không tồn tại.");
  }

  if (congthuc && congthuc.length === 0) {
    throw new ApiError(400, "Công thức không được để trống.");
  }

  const t = await sequelize.transaction();
  try {
    // 1. Cập nhật thông tin cơ bản của bánh
    await cake.update(
      {
        tenBANH,
        motaBANH,
        giaBANH,
        hinhanhBANH,
        idLB,
      },
      { transaction: t }
    );

    // 2. Nếu có gửi kèm công thức, thì xóa công thức cũ và thêm lại
    if (congthuc) {
      // 2a. Xóa công thức cũ
      await db.CongThuc.destroy({ where: { idBANH: id }, transaction: t });

      // 2b. Chuẩn bị và thêm công thức mới
      const recipeData = congthuc.map((item) => ({
        idBANH: id,
        idNL: item.idNL,
        soluong: item.soluong,
        donvi: item.donvi,
      }));
      await db.CongThuc.bulkCreate(recipeData, { transaction: t });
    }

    await t.commit();
    return cake;
  } catch (error) {
    await t.rollback();
    throw new ApiError(500, `Cập nhật sản phẩm thất bại: ${error.message}`);
  }
};

// Xóa bánh
const remove = async (id) => {
  const cake = await db.Banh.findByPk(id);
  if (!cake) {
    throw new Error("Bánh không tồn tại.");
  }
  await cake.destroy();
  return { message: "Xóa bánh thành công." };
};

const getFeatured = async () => {
  // Đây là một câu lệnh SQL phức tạp, chúng ta sẽ dùng Raw Query
  const [results] = await sequelize.query(`
        SELECT * FROM (
            SELECT 
                b.*, 
                lb.tenLOAIBANH,
                ROW_NUMBER() OVER(PARTITION BY b.idLB ORDER BY b.idBANH DESC) as rn
            FROM BANH b
            JOIN LOAIBANH lb ON b.idLB = lb.idLB
        ) as T
        WHERE T.rn = 1
        LIMIT 4;
    `);

  // Chuyển đổi giaBANH thành number
  return results.map((cake) => ({
    ...cake,
    giaBANH: parseFloat(cake.giaBANH),
    // Tạo object LoaiBanh để khớp với frontend
    LoaiBanh: { tenLOAIBANH: cake.tenLOAIBANH },
  }));
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getFeatured,
};
