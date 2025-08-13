// server.js (phiên bản cuối cùng, hoàn thiện)

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/api/models");

// --- Import các thành phần của ứng dụng ---
// Routes
const authRoutes = require("./src/api/routes/auth.route.js");
const categoryRoutes = require("./src/api/routes/category.route.js");
const cakeRoutes = require("./src/api/routes/cake.route.js");
const ingredientRoutes = require("./src/api/routes/ingredient.route.js");
const inventoryRoutes = require("./src/api/routes/inventory.route.js");
const productionRoutes = require("./src/api/routes/production.route.js");
const orderRoutes = require("./src/api/routes/order.route.js");
const userRoutes = require("./src/api/routes/user.route.js");
const statusRoutes = require("./src/api/routes/status.route.js"); // <-- THÊM DÒNG NÀY

// Error Handler
const errorHandler = require("./src/api/middlewares/errorHandler.middleware");

// --- Cấu hình và Khởi tạo Express App ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// --- Middlewares ---
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Cho phép đọc body dạng JSON
app.use(express.urlencoded({ extended: true })); // Cho phép đọc body từ form

// --- Routes ---
// Route cơ bản để kiểm tra server
app.get("/", (req, res) => {
  res.send("API Tiệm Bánh đang hoạt động!");
});

// Sử dụng các routes chức năng
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cakes", cakeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/statuses", statusRoutes); // <-- THÊM DÒNG NÀY

// --- Xử lý Lỗi và Khởi động Server ---
// Middleware xử lý lỗi (phải đặt ở cuối cùng, sau tất cả các routes)
app.use(errorHandler);

// Kết nối CSDL và khởi động server
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối cơ sở dữ liệu thành công.");
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại cổng http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Không thể kết nối tới cơ sở dữ liệu:", err);
  });
