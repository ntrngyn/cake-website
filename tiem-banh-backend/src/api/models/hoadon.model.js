// src/api/models/hoadon.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const HoaDon = sequelize.define(
    "HoaDon",
    {
      idHD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ngayxuatHD: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      idDH: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Một đơn hàng chỉ có một hóa đơn
      },
    },
    {
      tableName: "HOADON",
      timestamps: false,
    }
  );

  return HoaDon;
};
