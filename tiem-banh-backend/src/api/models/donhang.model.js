// src/api/models/donhang.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DonHang = sequelize.define(
    "DonHang",
    {
      idDH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ngaylapDH: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      tonggiatriDH: {
        type: DataTypes.DECIMAL(12, 2),
      },
      idNV: {
        type: DataTypes.INTEGER,
        allowNull: true, // Đơn hàng online có thể chưa có NV xử lý ngay
      },
      idKH: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idTTDH: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "DONHANG",
      timestamps: false,
    }
  );

  return DonHang;
};
