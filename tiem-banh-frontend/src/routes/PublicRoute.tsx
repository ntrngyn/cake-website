// src/routes/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

// Định nghĩa props cho component, nó sẽ nhận vào các component con (children)
interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  // Lấy trạng thái isAuthenticated từ Redux store
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Logic chính:
  // Nếu người dùng đã đăng nhập (isAuthenticated là true)...
  if (isAuthenticated) {
    // ...thì điều hướng họ về trang chủ.
    // `replace` được dùng để thay thế trang /login trong lịch sử duyệt web,
    // giúp người dùng không thể nhấn nút "Back" để quay lại trang login.
    return <Navigate to="/" replace />;
  }

  // Nếu người dùng chưa đăng nhập, hiển thị component con (trang Login hoặc Register)
  return <>{children}</>;
}