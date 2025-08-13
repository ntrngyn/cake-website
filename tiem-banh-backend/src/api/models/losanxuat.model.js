// src/api/models/losanxuat.model.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const LoSanXuat = sequelize.define(
    "LoSanXuat",
    {
      idLSX: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      idBANH: { type: DataTypes.INTEGER, allowNull: false },
      soLuongSanXuat: { type: DataTypes.INTEGER, allowNull: false },
      soLuongTon: { type: DataTypes.INTEGER, allowNull: false },
      ngaySanXuat: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      hanSuDung: { type: DataTypes.DATE, allowNull: false },
      idNV: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "LOSANXUAT", timestamps: false }
  );
  return LoSanXuat;
};
