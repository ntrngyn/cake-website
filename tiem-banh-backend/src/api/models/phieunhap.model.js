// src/api/models/phieunhap.model.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const PhieuNhap = sequelize.define(
    "PhieuNhap",
    {
      idPN: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ngayNhap: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      idNV: { type: DataTypes.INTEGER, allowNull: false },
      // idNCC: { type: DataTypes.INTEGER, allowNull: true }, // Nếu có bảng NhaCungCap
      tongTien: { type: DataTypes.DECIMAL(12, 2) },
      ghiChu: { type: DataTypes.TEXT },
    },
    { tableName: "PHIEUNHAP", timestamps: false }
  );
  return PhieuNhap;
};
