// src/api/models/index.js (phiên bản cập nhật đầy đủ)

const { Sequelize } = require("sequelize");
const config = require("../../config/database").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import tất cả các models
db.NhanVien = require("./nhanvien.model")(sequelize);
db.KhachHang = require("./khachhang.model")(sequelize);
db.LoaiBanh = require("./loaibanh.model")(sequelize);
db.Banh = require("./banh.model")(sequelize);
db.NguyenLieu = require("./nguyenlieu.model")(sequelize);
db.CongThuc = require("./congthuc.model")(sequelize);
db.TrangThaiDonHang = require("./trangthaidonhang.model")(sequelize);
db.DonHang = require("./donhang.model")(sequelize);
db.ChiTietDonHang = require("./chitietdonhang.model")(sequelize);
db.HoaDon = require("./hoadon.model")(sequelize);
db.PhieuNhap = require("./phieunhap.model")(sequelize);
db.ChiTietPhieuNhap = require("./chitietphieunhap.model")(sequelize);
db.LoSanXuat = require("./losanxuat.model")(sequelize);

// Định nghĩa các mối quan hệ (Associations)

// 1. LoaiBanh - Banh (1-N)
db.LoaiBanh.hasMany(db.Banh, { foreignKey: "idLB" });
db.Banh.belongsTo(db.LoaiBanh, { foreignKey: "idLB" });

// 2. NhanVien - DonHang (1-N)
db.NhanVien.hasMany(db.DonHang, { foreignKey: "idNV" });
db.DonHang.belongsTo(db.NhanVien, { foreignKey: "idNV" });

// 3. KhachHang - DonHang (1-N)
db.KhachHang.hasMany(db.DonHang, { foreignKey: "idKH" });
db.DonHang.belongsTo(db.KhachHang, { foreignKey: "idKH" });

// 4. TrangThaiDonHang - DonHang (1-N)
db.TrangThaiDonHang.hasMany(db.DonHang, { foreignKey: "idTTDH" });
db.DonHang.belongsTo(db.TrangThaiDonHang, { foreignKey: "idTTDH" });

// 5. DonHang - HoaDon (1-1)
db.DonHang.hasOne(db.HoaDon, { foreignKey: "idDH" });
db.HoaDon.belongsTo(db.DonHang, { foreignKey: "idDH" });

// 6. Banh - NguyenLieu (N-N) thông qua CongThuc
db.Banh.belongsToMany(db.NguyenLieu, {
  through: db.CongThuc,
  foreignKey: "idBANH",
  otherKey: "idNL",
});
db.NguyenLieu.belongsToMany(db.Banh, {
  through: db.CongThuc,
  foreignKey: "idNL",
  otherKey: "idBANH",
});

// 7. DonHang - Banh (N-N) thông qua ChiTietDonHang
db.DonHang.belongsToMany(db.Banh, {
  through: db.ChiTietDonHang,
  foreignKey: "idDH",
  otherKey: "idBANH",
});
db.Banh.belongsToMany(db.DonHang, {
  through: db.ChiTietDonHang,
  foreignKey: "idBANH",
  otherKey: "idDH",
});

db.NhanVien.hasMany(db.PhieuNhap, { foreignKey: "idNV" });
db.PhieuNhap.belongsTo(db.NhanVien, { foreignKey: "idNV" });

db.PhieuNhap.hasMany(db.ChiTietPhieuNhap, {
  foreignKey: "idPN",
  as: "details",
});
db.ChiTietPhieuNhap.belongsTo(db.PhieuNhap, { foreignKey: "idPN" });

db.NguyenLieu.hasMany(db.ChiTietPhieuNhap, { foreignKey: "idNL" });
db.ChiTietPhieuNhap.belongsTo(db.NguyenLieu, { foreignKey: "idNL" });

// Mối quan hệ cho Lô Sản Xuất
db.Banh.hasMany(db.LoSanXuat, { foreignKey: "idBANH" });
db.LoSanXuat.belongsTo(db.Banh, { foreignKey: "idBANH" });

db.NhanVien.hasMany(db.LoSanXuat, { foreignKey: "idNV" });
db.LoSanXuat.belongsTo(db.NhanVien, { foreignKey: "idNV" });

module.exports = db;
