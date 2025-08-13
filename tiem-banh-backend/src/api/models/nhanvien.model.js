// src/api/models/nhanvien.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const NhanVien = sequelize.define(
    "NhanVien",
    {
      idNV: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "idNV", // Đảm bảo tên trường khớp với CSDL
      },
      hotenNV: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      sdtNV: {
        type: DataTypes.STRING(15),
        unique: true,
      },
      ngaysinhNV: {
        type: DataTypes.DATE,
      },
      diachiNV: {
        type: DataTypes.STRING(255),
      },
      matkhauNV: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      chucvuNV: {
        type: DataTypes.STRING(50),
      },
      emailNV: {
        type: DataTypes.STRING(100),
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      ngaythueNV: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "NHANVIEN", // Tên bảng trong CSDL
      timestamps: false, // Không sử dụng các trường createdAt, updatedAt tự động
    }
  );

  return NhanVien;
};
