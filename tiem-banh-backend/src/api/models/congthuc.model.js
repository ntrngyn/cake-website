// src/api/models/congthuc.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CongThuc = sequelize.define(
    "CongThuc",
    {
      // idBANH và idNL sẽ là khóa ngoại, đồng thời là khóa chính kết hợp
      idBANH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      idNL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      soluong: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      donvi: {
        type: DataTypes.STRING(50),
      },
    },
    {
      tableName: "CONGTHUC",
      timestamps: false,
    }
  );

  return CongThuc;
};
