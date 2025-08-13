// src/api/models/chitietphieunhap.model.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const ChiTietPhieuNhap = sequelize.define(
    "ChiTietPhieuNhap",
    {
      idCTPN: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPN: { type: DataTypes.INTEGER, allowNull: false },
      idNL: { type: DataTypes.INTEGER, allowNull: false },
      soLuongNhap: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      donGiaNhap: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      hanSuDung: { type: DataTypes.DATE, allowNull: false },
      thanhTien: { type: DataTypes.DECIMAL(12, 2) },
    },
    { tableName: "CHITIETPHIEUNHAP", timestamps: false }
  );
  return ChiTietPhieuNhap;
};
