// src/api/services/order.service.js

const db = require("../models");
const { sequelize } = require("../models");
const ApiError = require("../../utils/ApiError"); // Import ApiError
const { ORDER_STATUS } = require("../../utils/constants"); // Import hằng số trạng thái

// --- HÀM HELPER (Không thay đổi) ---
async function deductIngredientsForCake(idBANH, quantity, transaction) {
  const cakeWithRecipe = await db.Banh.findByPk(idBANH, {
    include: { model: db.NguyenLieu },
    transaction,
  });
  if (!cakeWithRecipe || !cakeWithRecipe.NguyenLieus.length) {
    throw new ApiError(
      404,
      `Bánh với ID ${idBANH} không có công thức hoặc không tồn tại.`
    );
  }

  for (const ingredient of cakeWithRecipe.NguyenLieus) {
    const requiredAmount = ingredient.CongThuc.soluong * quantity;
    let deductedAmount = 0;

    const stockLots = await db.ChiTietPhieuNhap.findAll({
      where: {
        idNL: ingredient.idNL,
        soLuongNhap: { [db.Sequelize.Op.gt]: 0 },
      },
      order: [["hanSuDung", "ASC"]],
      transaction,
    });

    for (const lot of stockLots) {
      if (deductedAmount >= requiredAmount) break;
      const amountToDeduct = Math.min(
        lot.soLuongNhap,
        requiredAmount - deductedAmount
      );
      await lot.decrement("soLuongNhap", { by: amountToDeduct, transaction });
      await db.NguyenLieu.decrement("soluongtonNL", {
        by: amountToDeduct,
        where: { idNL: ingredient.idNL },
        transaction,
      });
      deductedAmount += amountToDeduct;
    }

    if (deductedAmount < requiredAmount) {
      throw new ApiError(
        400,
        `Không đủ nguyên liệu "${ingredient.tenNL}" để làm bánh.`
      );
    }
  }
}

// --- CÁC HÀM SERVICE CHÍNH (Đã được cải thiện) ---

const createOrder = async (orderData) => {
  const { idKH, items } = orderData;
  if (!items || items.length === 0) {
    throw new ApiError(400, "Đơn hàng phải có ít nhất một sản phẩm.");
  }

  const t = await sequelize.transaction();
  try {
    const cakeIds = items.map((item) => item.idBANH);
    const cakes = await db.Banh.findAll({
      where: { idBANH: cakeIds },
      transaction: t,
    });
    const cakePriceMap = new Map(
      cakes.map((cake) => [cake.idBANH, cake.giaBANH])
    );

    let tonggiatriDH = 0;
    const chiTietItems = items.map((item) => {
      const giaBANHLUCBAN = parseFloat(cakePriceMap.get(item.idBANH));
      if (isNaN(giaBANHLUCBAN))
        throw new ApiError(404, `Bánh với ID ${item.idBANH} không tồn tại.`);
      const thanhtien = item.soluong * giaBANHLUCBAN;
      tonggiatriDH += thanhtien;
      return {
        idBANH: item.idBANH,
        soluong: item.soluong,
        giaBANHLUCBAN,
        thanhtien,
      };
    });

    const newOrder = await db.DonHang.create(
      {
        idKH,
        tonggiatriDH,
        idTTDH: ORDER_STATUS.PENDING_CONFIRMATION, // Sử dụng hằng số
      },
      { transaction: t }
    );

    await db.ChiTietDonHang.bulkCreate(
      chiTietItems.map((item) => ({ ...item, idDH: newOrder.idDH })),
      { transaction: t }
    );

    await t.commit();
    return newOrder;
  } catch (error) {
    await t.rollback();
    // Ném lại lỗi gốc nếu nó đã là ApiError, nếu không thì tạo lỗi mới
    throw error instanceof ApiError
      ? error
      : new ApiError(500, `Tạo đơn hàng thất bại: ${error.message}`);
  }
};

// Cập nhật trạng thái đơn hàng (phiên bản cuối cùng, có State Machine)
const updateOrderStatus = async (idDH, idTTDH, idNV) => {
  const t = await sequelize.transaction();
  try {
    // const order = await db.DonHang.findByPk(idDH, { transaction: t });
    // --- SỬA LẠI DÒNG NÀY ---
    const order = await db.DonHang.findByPk(idDH, {
      include: {
        model: db.TrangThaiDonHang,
        attributes: ["tenTrangThaiDH"],
      },
      transaction: t,
    });
    // -------------------------
    if (!order) {
      throw new ApiError(404, "Đơn hàng không tồn tại.");
    }

    const currentStatus = order.idTTDH;
    const newStatusId = parseInt(idTTDH, 10);

    // --- BỘ QUY TẮC CHUYỂN ĐỔI TRẠNG THÁI ---
    const allowedTransitions = {
      [ORDER_STATUS.PENDING_CONFIRMATION]: [
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.PROCESSING]: [
        ORDER_STATUS.SHIPPING,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.COMPLETED],
      // Đơn hàng đã hoàn thành hoặc đã hủy thì không thể thay đổi nữa
      [ORDER_STATUS.COMPLETED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };

    // Kiểm tra xem việc chuyển trạng thái có hợp lệ không
    if (
      !allowedTransitions[currentStatus] ||
      !allowedTransitions[currentStatus].includes(newStatusId)
    ) {
      throw new ApiError(
        400,
        `Không thể chuyển trạng thái từ "${order.TrangThaiDonHang?.tenTrangThaiDH || currentStatus}" sang trạng thái mới.`
      );
    }
    // ------------------------------------

    // Logic trừ kho chỉ kích hoạt một lần duy nhất:
    // KHI trạng thái mới là "Đang xử lý" (2)
    // VÀ trạng thái cũ là "Chờ xác nhận" (1)
    if (
      newStatusId === ORDER_STATUS.PROCESSING &&
      currentStatus === ORDER_STATUS.PENDING_CONFIRMATION
    ) {
      console.log(`--- Kích hoạt trừ kho cho Đơn hàng #${idDH} ---`); // Thêm log để debug
      const orderDetails = await db.ChiTietDonHang.findAll({
        where: { idDH },
        transaction: t,
      });

      for (const item of orderDetails) {
        let quantityToFulfill = item.soluong;

        // Ưu tiên 1: Trừ kho thành phẩm
        const availableBatches = await db.LoSanXuat.findAll({
          where: {
            idBANH: item.idBANH,
            soLuongTon: { [db.Sequelize.Op.gt]: 0 },
            hanSuDung: { [db.Sequelize.Op.gte]: new Date() },
          },
          order: [["hanSuDung", "ASC"]],
          transaction: t,
        });

        for (const batch of availableBatches) {
          if (quantityToFulfill <= 0) break;
          const deductFromBatch = Math.min(batch.soLuongTon, quantityToFulfill);
          await batch.decrement("soLuongTon", {
            by: deductFromBatch,
            transaction: t,
          });
          quantityToFulfill -= deductFromBatch;
        }

        // Ưu tiên 2: Trừ kho nguyên liệu
        if (quantityToFulfill > 0) {
          await deductIngredientsForCake(item.idBANH, quantityToFulfill, t);
        }
      }
    }

    // (Tùy chọn) Logic hoàn lại kho nếu đơn hàng bị hủy
    if (
      newStatusId === ORDER_STATUS.CANCELLED &&
      currentStatus !== ORDER_STATUS.PENDING_CONFIRMATION
    ) {
      // Đây là một logic phức tạp: cần xác định hàng đã trừ từ đâu để hoàn lại.
      // Tạm thời bỏ qua trong phạm vi niên luận.
      console.log(`--- LOGIC HOÀN KHO CHO ĐƠN HÀNG #${idDH} (nếu cần) ---`);
    }

    // Luôn cập nhật trạng thái mới
    order.idTTDH = newStatusId;
    order.idNV = idNV;
    await order.save({ transaction: t });

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error instanceof ApiError
      ? error
      : new ApiError(500, `Cập nhật trạng thái thất bại: ${error.message}`);
  }
};

const getMyOrders = async (idKH) => {
  return await db.DonHang.findAll({
    where: { idKH },
    include: [{ model: db.TrangThaiDonHang, attributes: ["tenTrangThaiDH"] }],
    order: [["ngaylapDH", "DESC"]],
  });
};

// Lấy tất cả đơn hàng (cho Admin)
const getAllOrders = async () => {
  // SỬA LẠI HÀM NÀY
  const orders = await db.DonHang.findAll({
    include: [
      {
        model: db.KhachHang,
        attributes: ["idKH", "hotenKH"], // Chỉ lấy các trường cần thiết
      },
      {
        model: db.NhanVien,
        attributes: ["idNV", "hotenNV"],
      },
      {
        model: db.TrangThaiDonHang,
        attributes: ["tenTrangThaiDH"],
      },
    ],
    order: [["ngaylapDH", "DESC"]],
  });

  // Chuyển đổi DECIMAL thành number để frontend dễ xử lý
  const transformedOrders = orders.map((order) => {
    const plainOrder = order.get({ plain: true });
    return {
      ...plainOrder,
      tonggiatriDH: parseFloat(plainOrder.tonggiatriDH),
    };
  });

  return transformedOrders;
};

const getOrderById = async (idDH) => {
  const order = await db.DonHang.findByPk(idDH, {
    include: [
      { model: db.KhachHang },
      { model: db.NhanVien },
      { model: db.TrangThaiDonHang },
      {
        model: db.Banh,
        through: { attributes: ["soluong", "giaBANHLUCBAN", "thanhtien"] },
      },
    ],
  });
  if (!order) throw new ApiError(404, "Đơn hàng không tồn tại.");
  return order;
};

module.exports = {
  createOrder,
  updateOrderStatus,
  getMyOrders,
  getAllOrders,
  getOrderById,
};
