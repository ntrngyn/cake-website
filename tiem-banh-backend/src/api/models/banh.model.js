// src/api/models/banh.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Banh = sequelize.define(
    "Banh",
    {
      idBANH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tenBANH: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      motaBANH: {
        type: DataTypes.TEXT,
      },
      giaBANH: {
        type: DataTypes.DECIMAL(10, 2), // Hỗ trợ số thập phân cho giá
        allowNull: false,
      },
      hinhanhBANH: {
        type: DataTypes.STRING(255),
      },
      idLB: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "BANH",
      timestamps: false,
    }
  );

  return Banh;
};
