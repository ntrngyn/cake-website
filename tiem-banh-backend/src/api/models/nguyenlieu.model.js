// src/api/models/nguyenlieu.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const NguyenLieu = sequelize.define(
    "NguyenLieu",
    {
      idNL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tenNL: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      donviNL: {
        type: DataTypes.STRING(50),
      },
      // gianhapNL: {
      //   type: DataTypes.DECIMAL(10, 2),
      // },
      soluongtonNL: {
        type: DataTypes.DECIMAL(10, 2),
      },
      soluongtontoithieuNL: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      tableName: "NGUYENLIEU",
      timestamps: false,
    }
  );

  return NguyenLieu;
};
