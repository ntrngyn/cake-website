// src/api/services/status.service.js
const db = require("../models");

const getAll = async () => {
  // Lấy tất cả các trạng thái và sắp xếp theo ID
  const statuses = await db.TrangThaiDonHang.findAll({
    order: [["idTTDH", "ASC"]],
  });
  return statuses;
};

module.exports = {
  getAll,
};
