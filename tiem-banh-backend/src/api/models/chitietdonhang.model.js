// src/api/models/chitietdonhang.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ChiTietDonHang = sequelize.define(
    "ChiTietDonHang",
    {
      idBANH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      idDH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      soluong: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      giaBANHLUCBAN: {
        // Lưu lại giá bán tại thời điểm đặt hàng
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      thanhtien: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    },
    {
      tableName: "CHITIETDONHANG",
      timestamps: false,
    }
  );

  return ChiTietDonHang;
};
