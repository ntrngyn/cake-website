# Hệ thống Quản lý và Bán hàng Tiệm bánh - Sweet & Savory

Đây là dự án Niên luận Cơ sở ngành, xây dựng một ứng dụng web full-stack hoàn chỉnh nhằm mục đích hiện đại hóa và tối ưu hóa quy trình vận hành cho một tiệm bánh.

Hệ thống bao gồm hai phần chính:

1.  **Trang web công khai (Public Website):** Giao diện thương mại điện tử dành cho khách hàng, cho phép họ duyệt xem sản phẩm, quản lý giỏ hàng và đặt hàng trực tuyến.
2.  **Trang Quản trị (Admin Panel):** Một hệ thống quản trị nội bộ mạnh mẽ dành cho nhân viên và chủ tiệm, cung cấp đầy đủ công cụ để quản lý toàn bộ hoạt động kinh doanh.

## ✨ Tính Năng Nổi Bật

### Đối với Khách hàng

- **Xác thực người dùng:** Đăng ký và đăng nhập an toàn.
- **Duyệt sản phẩm:** Xem danh sách sản phẩm với hình ảnh, mô tả và giá cả chi tiết.
- **Tìm kiếm & Lọc:** Dễ dàng tìm kiếm sản phẩm theo tên hoặc lọc theo loại bánh.
- **Quản lý Giỏ hàng:** Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng.
- **Đặt hàng:** Quy trình đặt hàng và thanh toán đơn giản.
- **Quản lý Tài khoản:** Xem và cập nhật thông tin cá nhân, theo dõi lịch sử đơn hàng.

### Đối với Quản trị viên & Nhân viên

- **Phân quyền chi tiết (Role-Based Access Control):** Hệ thống phân quyền rõ ràng cho từng vai trò (Admin, Nhân viên bán hàng, Quản lý kho,...) để đảm bảo an toàn dữ liệu.
- **Quản lý Tài khoản:** Tạo, xem, sửa, xóa tài khoản cho cả khách hàng và nhân viên.
- **Quản lý Sản phẩm:** Quản lý thông tin chi tiết của từng sản phẩm bánh.
- **Quản lý Loại bánh:** Quản lý các danh mục sản phẩm.
- **Quản lý Nguyên liệu:** Theo dõi danh sách và tồn kho của các nguyên vật liệu.
- **Quản lý Nhập kho:** Ghi nhận lịch sử và tạo các phiếu nhập kho mới, tự động cập nhật số lượng tồn kho nguyên liệu.
- **Quản lý Sản xuất:** Ghi nhận các lô bánh được sản xuất, tự động trừ nguyên liệu tồn kho dựa trên công thức và cập nhật tồn kho thành phẩm.
- **Quản lý Đơn hàng:** Theo dõi và cập nhật trạng thái của tất cả các đơn hàng.

## 🚀 Công Nghệ Sử Dụng

Dự án được xây dựng theo kiến trúc Client-Server với các công nghệ hiện đại và phổ biến.

### **Backend (`tiem-banh-backend`)**

- **Nền tảng:** Node.js
- **Framework:** Express.js
- **Cơ sở dữ liệu:** MySQL
- **ORM:** Sequelize (để tương tác với CSDL)
- **Xác thực:** JSON Web Tokens (JWT)
- **Bảo mật:** Bcrypt (để băm mật khẩu)
- **Kiến trúc:** Layered Architecture (Routes -> Controllers -> Services -> Models)

### **Frontend (`tiem-banh-frontend`)**

- **Thư viện:** React
- **Ngôn ngữ:** TypeScript
- **Công cụ xây dựng:** Vite
- **Quản lý trạng thái:** Redux Toolkit
- **Thư viện UI:** Material-UI (MUI)
- **Routing:** React Router
- **Gọi API:** Axios
- **Validation Form:** React Hook Form & Yup

## ⚙️ Cài Đặt và Chạy Dự Án

### **Yêu cầu hệ thống**

- Node.js (phiên bản 18.x trở lên)
- npm hoặc yarn
- Một hệ quản trị CSDL MySQL đang chạy

### **1. Cài đặt Backend**

```bash
# Di chuyển vào thư mục backend
cd tiem-banh-backend

# Cài đặt các gói phụ thuộc
npm install

# Tạo một file .env ở thư mục gốc của backend và điền các thông tin sau:
# (Xem file .env.example để biết chi tiết)
PORT=8888
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tiem_banh_db
JWT_SECRET=your_jwt_secret_key

# Quan trọng: Chạy script .sql bạn đã tạo để thiết lập CSDL và dữ liệu mẫu.

# Khởi động server backend
npm start
```

### **2. Cài đặt Frontend**

```bash
# Mở một cửa sổ terminal mới, di chuyển vào thư mục frontend
cd tiem-banh-frontend

# Cài đặt các gói phụ thuộc
npm install

# Tạo một file .env ở thư mục gốc của frontend và điền thông tin sau:
VITE_API_BASE_URL=http://localhost:8888/api

# Khởi động server frontend
npm run dev
```

Sau khi hoàn thành, bạn có thể truy cập:

- **Trang web cho khách hàng:** `http://localhost:5173`
- **API Backend:** `http://localhost:8888`

## ✍️ Tác giả

- **Nguyễn Trọng Nguyên** - _Sinh viên Khoa học Máy tính, Đại học Cần Thơ_

## 🙏 Lời Cảm Ơn

Em xin chân thành cảm ơn Giảng viên hướng dẫn và Khoa Khoa học Máy tính - Trường Đại học Cần Thơ đã tạo điều kiện và hỗ trợ em hoàn thành dự án này.
