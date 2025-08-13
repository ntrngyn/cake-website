// src/routes/UserRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { Box, CircularProgress } from "@mui/material";

interface UserRouteProps {
  children: React.ReactNode;
}

export default function UserRoute({ children }: UserRouteProps) {
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Kịch bản 1: Đang chờ khôi phục phiên (khi reload)
  // Có token trong localStorage/state, nhưng chưa có thông tin user chi tiết.
  if (token && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Kịch bản 2: Không đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kịch bản 3: Hợp lệ
  return <>{children}</>;
}
