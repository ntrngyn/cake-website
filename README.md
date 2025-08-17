# Hệ thống Quản lý và Bán hàng Tiệm bánh - Sweet & Savory

Dự án Niên luận Cơ sở ngành: Xây dựng ứng dụng web full-stack để quản lý và vận hành một tiệm bánh.

## ✨ Tính Năng Chính

- **Phía Khách hàng:** Duyệt sản phẩm, tìm kiếm, quản lý giỏ hàng, đặt hàng, và theo dõi lịch sử mua hàng.
- **Phía Quản trị:** Quản lý toàn diện sản phẩm, đơn hàng, khách hàng, nhân viên, tồn kho nguyên liệu, phiếu nhập kho và các lô sản xuất.
- **Phân quyền:** Hệ thống phân quyền chi tiết dựa trên vai trò (Admin, Nhân viên bán hàng, Quản lý kho,...).

## 🚀 Công Nghệ Sử Dụng

- **Backend:** Node.js, Express.js, MySQL, Sequelize, JWT.
- **Frontend:** React, TypeScript, Vite, Redux Toolkit, Material-UI (MUI).
- **Kiến trúc:** Client-Server với RESTful API.

## ⚙️ Hướng Dẫn Cài Đặt

### 1. Backend

```bash
# Vào thư mục backend
cd tiem-banh-backend

# Cài đặt
npm install

# Sao chép file .env.example thành .env và cấu hình CSDL
# Chạy script SQL để tạo database

# Khởi động
npm start
```

> API sẽ chạy tại `http://localhost:8888`

### 2. Frontend

```bash
# Vào thư mục frontend
cd tiem-banh-frontend

# Cài đặt
npm install

# Tạo file .env và cấu hình: VITE_API_BASE_URL=http://localhost:8888/api

# Khởi động
npm run dev
```

> Trang web sẽ chạy tại `http://localhost:5173`

## ✍️ Tác giả

- **Nguyễn Trọng Nguyên** - _Sinh viên Khoa học Máy tính, Đại học Cần Thơ_
