// src/api/models/loaibanh.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LoaiBanh = sequelize.define(
    "LoaiBanh",
    {
      idLB: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tenLOAIBANH: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "LOAIBANH",
      timestamps: false,
    }
  );

  return LoaiBanh;
};
