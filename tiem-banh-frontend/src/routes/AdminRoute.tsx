// src/routes/AdminRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function AdminRoute({
  children,
  allowedRoles,
}: AdminRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // === THÊM CÁC DÒNG DEBUG VÀO ĐÂY ===
  // console.group("--- AdminRoute Check ---");
  // console.log("Đang ở trang:", location.pathname);
  // console.log("Đã đăng nhập?", isAuthenticated);
  // console.log("Đối tượng user từ Redux:", user);
  // console.log("Vai trò của user:", user?.role);
  // console.log("Các vai trò được phép:", allowedRoles);
  const isAllowed = user ? allowedRoles.includes(user.role) : false;
  // console.log("Kết quả kiểm tra (isAllowed):", isAllowed);
  // console.groupEnd();
  // ===================================

  // Logic đã được đơn giản hóa tối đa
  // Vì App.tsx đã xử lý trạng thái loading,
  // nên khi code chạy đến đây, chúng ta có thể tin rằng
  // thông tin xác thực đã ở trạng thái cuối cùng.

  // 1. Nếu không đăng nhập -> về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Nếu không có user object hoặc vai trò không đúng -> về trang chủ
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  // 3. Nếu mọi thứ đều hợp lệ -> cho vào
  return <>{children}</>;
}
