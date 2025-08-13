// src/api/models/khachhang.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const KhachHang = sequelize.define(
    "KhachHang",
    {
      idKH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      hotenKH: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      sdtKH: {
        type: DataTypes.STRING(15),
      },
      ngaysinhKH: {
        type: DataTypes.DATE,
      },
      diachiKH: {
        type: DataTypes.STRING(255),
      },
      taikhoanKH: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      matkhauKH: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      emailKH: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      ngaytaoKH: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "KHACHHANG",
      timestamps: false,
    }
  );

  return KhachHang;
};
