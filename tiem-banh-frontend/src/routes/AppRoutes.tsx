// src/routes/AppRoutes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import App from "../App";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
// Route Protectors
import PublicRoute from "./PublicRoute";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
// Public Pages
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductDetailPage from "../pages/public/ProductDetailPage";
import CartPage from "../pages/public/CartPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import ProfilePage from "../pages/public/ProfilePage";
import AccountInfoPage from "../pages/public/AccountInfoPage";
import OrderHistoryPage from "../pages/public/OrderHistoryPage";
// import AuthRedirector from "../pages/public/AuthRedirector";
import AboutPage from "../pages/public/AboutPage"; // <-- Đã import
// Admin Pages
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import OrderManagementPage from "../pages/admin/OrderManagementPage";
import CategoryManagementPage from "../pages/admin/CategoryManagementPage";
import IngredientManagementPage from "../pages/admin/IngredientManagementPage";
import StockInHistoryPage from "../pages/admin/StockInHistoryPage";
import ProductionHistoryPage from "../pages/admin/ProductionHistoryPage";

// Định nghĩa các vai trò được phép vào trang quản trị
const employeeRoles = [
  "Admin",
  "Quản lý",
  "Quản lý kho",
  "Nhân viên bán hàng",
  "Thợ làm bánh",
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Component gốc chỉ chứa logic toàn cục và <Outlet />
    // errorElement: <NotFoundPage />,
    children: [
      // =======================================================
      // === Nhóm Route cho Admin (sử dụng AdminLayout)      ===
      // =======================================================
      {
        path: "admin",
        element: (
          <AdminRoute allowedRoles={employeeRoles}>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "products", element: <ProductManagementPage /> },
          { path: "orders", element: <OrderManagementPage /> },
          { path: "categories", element: <CategoryManagementPage /> },
          { path: "ingredients", element: <IngredientManagementPage /> },
          { path: "inventory", element: <StockInHistoryPage /> },
          { path: "production", element: <ProductionHistoryPage /> },
        ],
      },

      // =======================================================
      // === Nhóm Route cho Khách Hàng (sử dụng PublicLayout) ===
      // =======================================================
      {
        // Route này không có path, nó sẽ render PublicLayout cho tất cả các route con bên trong
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "products", element: <ProductsPage /> },
          { path: "products/:id", element: <ProductDetailPage /> },
          { path: "about", element: <AboutPage /> },
          { path: "cart", element: <CartPage /> },
          {
            path: "login",
            element: (
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            ),
          },
          {
            path: "register",
            element: (
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            ),
          },
          // {
          //   path: "auth/redirect",
          //   element: (
          //     <UserRoute>
          //       <AuthRedirector />
          //     </UserRoute>
          //   ),
          // },
          {
            path: "profile",
            element: (
              <UserRoute>
                <ProfilePage />
              </UserRoute>
            ),
            children: [
              { index: true, element: <AccountInfoPage /> },
              { path: "orders", element: <OrderHistoryPage /> },
            ],
          },
          {
            path: "checkout",
            element: (
              <UserRoute>
                <CheckoutPage />
              </UserRoute>
            ),
          },
          // Route 404 cho khu vực public
          { path: "*", element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
