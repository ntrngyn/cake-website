// src/api/services/inventory.service.js
const db = require("../models");
const { sequelize } = require("../models"); // Import sequelize instance để dùng transaction

// Tạo phiếu nhập kho
const createStockIn = async (data) => {
  const { idNV, ghiChu, details } = data; // details là mảng các chi tiết phiếu nhập

  if (!details || details.length === 0) {
    throw new Error("Chi tiết phiếu nhập không được để trống.");
  }

  // Bắt đầu một transaction
  const t = await sequelize.transaction();

  try {
    // Tính tổng tiền phiếu nhập
    let tongTien = 0;
    for (const item of details) {
      item.thanhTien = item.soLuongNhap * item.donGiaNhap;
      tongTien += item.thanhTien;
    }

    // 1. Tạo Phiếu Nhập
    const phieuNhap = await db.PhieuNhap.create(
      {
        idNV,
        ghiChu,
        tongTien,
      },
      { transaction: t }
    );

    // 2. Thêm idPN vào mỗi chi tiết và tạo ChiTietPhieuNhap
    const chiTietPromises = details.map((item) => {
      return db.ChiTietPhieuNhap.create(
        {
          ...item,
          idPN: phieuNhap.idPN,
        },
        { transaction: t }
      );
    });
    await Promise.all(chiTietPromises);

    // 3. Cập nhật số lượng tồn kho cho từng nguyên liệu
    const updateStockPromises = details.map((item) => {
      return db.NguyenLieu.increment("soluongtonNL", {
        by: item.soLuongNhap,
        where: { idNL: item.idNL },
        transaction: t,
      });
    });
    await Promise.all(updateStockPromises);

    // Nếu tất cả thành công, commit transaction
    await t.commit();

    // Trả về phiếu nhập vừa tạo với đầy đủ chi tiết
    return await db.PhieuNhap.findByPk(phieuNhap.idPN, {
      include: { model: db.ChiTietPhieuNhap, as: "details" },
    });
  } catch (error) {
    // Nếu có lỗi, rollback transaction
    await t.rollback();
    throw new Error(`Tạo phiếu nhập thất bại: ${error.message}`);
  }
};

// Lấy danh sách phiếu nhập
const getAllStockIn = async () => {
  const stockIns = await db.PhieuNhap.findAll({
    include: [
      {
        model: db.NhanVien,
        attributes: ["idNV", "hotenNV"], // Chỉ lấy các trường cần thiết
      },
    ],
    order: [["ngayNhap", "DESC"]],
  });

  // Chuyển đổi DECIMAL thành number và đảm bảo dữ liệu thuần túy
  const transformedStockIns = stockIns.map((item) => {
    const plainItem = item.get({ plain: true });
    return {
      ...plainItem,
      tongTien: plainItem.tongTien ? parseFloat(plainItem.tongTien) : 0,
    };
  });

  return transformedStockIns;
};

// Lấy chi tiết một phiếu nhập
const getStockInById = async (id) => {
  const phieuNhap = await db.PhieuNhap.findByPk(id, {
    include: [
      { model: db.NhanVien, attributes: ["hotenNV"] },
      {
        model: db.ChiTietPhieuNhap,
        as: "details",
        include: [{ model: db.NguyenLieu, attributes: ["tenNL", "donviNL"] }],
      },
    ],
  });
  if (!phieuNhap) throw new Error("Phiếu nhập không tồn tại.");
  return phieuNhap;
};

module.exports = { createStockIn, getAllStockIn, getStockInById };
