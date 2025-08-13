// src/api/models/trangthaidonhang.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TrangThaiDonHang = sequelize.define(
    "TrangThaiDonHang",
    {
      idTTDH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tenTrangThaiDH: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "TRANGTHAIDONHANG",
      timestamps: false,
    }
  );

  return TrangThaiDonHang;
};
