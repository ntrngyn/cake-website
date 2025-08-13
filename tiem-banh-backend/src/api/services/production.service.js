// src/api/services/production.service.js
const db = require("../models");
const { sequelize } = require("../models");

const createProductionBatch = async (data) => {
  const { idBANH, soLuongSanXuat, hanSuDung, idNV } = data;

  const t = await sequelize.transaction();

  try {
    // 1. Lấy công thức của bánh
    const cakeWithRecipe = await db.Banh.findByPk(idBANH, {
      include: { model: db.NguyenLieu },
      transaction: t,
    });
    if (
      !cakeWithRecipe ||
      !cakeWithRecipe.NguyenLieus ||
      cakeWithRecipe.NguyenLieus.length === 0
    ) {
      throw new Error("Bánh không có công thức hoặc không tồn tại.");
    }

    const recipe = cakeWithRecipe.NguyenLieus;

    // 2. Trừ kho nguyên liệu theo FEFO (First-Expired, First-Out)
    for (const ingredientInRecipe of recipe) {
      const requiredAmount =
        ingredientInRecipe.CongThuc.soluong * soLuongSanXuat;
      let deductedAmount = 0;

      // Lấy các lô nhập kho của nguyên liệu này, sắp xếp theo HSD gần nhất
      const stockLots = await db.ChiTietPhieuNhap.findAll({
        where: {
          idNL: ingredientInRecipe.idNL,
          soLuongNhap: { [db.Sequelize.Op.gt]: 0 }, // Chỉ lấy lô còn hàng
        },
        order: [["hanSuDung", "ASC"]],
        transaction: t,
      });

      for (const lot of stockLots) {
        if (deductedAmount >= requiredAmount) break;

        const amountToDeduct = Math.min(
          lot.soLuongNhap,
          requiredAmount - deductedAmount
        );

        // Trừ số lượng trong lô nhập kho
        await lot.decrement("soLuongNhap", {
          by: amountToDeduct,
          transaction: t,
        });
        // Trừ số lượng tổng trong bảng NguyenLieu
        await db.NguyenLieu.decrement("soluongtonNL", {
          by: amountToDeduct,
          where: { idNL: ingredientInRecipe.idNL },
          transaction: t,
        });

        deductedAmount += amountToDeduct;
      }

      // Kiểm tra xem đã trừ đủ số lượng cần thiết chưa
      if (deductedAmount < requiredAmount) {
        throw new Error(
          `Không đủ nguyên liệu "${ingredientInRecipe.tenNL}" trong kho.`
        );
      }
    }

    // 3. Tạo lô sản xuất
    const newBatch = await db.LoSanXuat.create(
      {
        idBANH,
        soLuongSanXuat,
        soLuongTon: soLuongSanXuat, // Ban đầu số lượng tồn = số lượng sản xuất
        hanSuDung,
        idNV,
      },
      { transaction: t }
    );

    await t.commit();
    return newBatch;
  } catch (error) {
    await t.rollback();
    throw new Error(`Tạo lô sản xuất thất bại: ${error.message}`);
  }
};

const getAllBatches = async () => {
  const batches = await db.LoSanXuat.findAll({
    include: [
      {
        model: db.Banh,
        attributes: ["idBANH", "tenBANH"],
      },
      {
        model: db.NhanVien,
        attributes: ["idNV", "hotenNV"],
      },
    ],
    order: [["ngaySanXuat", "DESC"]],
    // --- THÊM DÒNG NÀY ---
    // 'raw: true' sẽ buộc Sequelize trả về object JavaScript thuần túy,
    // tránh các vấn đề về định dạng ngày tháng của Model Instance.
    raw: true,
    nest: true, // 'nest: true' cần thiết khi dùng 'raw: true' với 'include'
  });
  // Dùng .get({ plain: true }) để đảm bảo frontend nhận được object thuần túy
  return batches;
};

module.exports = { createProductionBatch, getAllBatches };
