// src/App.tsx
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { fetchUserFromToken } from "./redux/authSlice";
import { Box, CircularProgress } from "@mui/material";

/**
 * Component gốc của ứng dụng.
 * Chỉ chứa logic toàn cục và <Outlet /> để render các layout khác nhau.
 * KHÔNG chứa bất kỳ thẻ HTML nào liên quan đến layout.
 */
function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Chỉ fetch khi có token và chưa có thông tin user
    // Điều này ngăn nó chạy lại ngay sau khi login
    if (token && !user) {
      dispatch(fetchUserFromToken());
    }
  }, [dispatch, token, user]);

  // --- LOGIC MỚI QUAN TRỌNG NHẤT ---
  // Màn hình loading toàn cục chỉ hiển thị trong một trường hợp duy nhất:
  // KHI TẢI LẠI TRANG (có token trong localStorage nhưng chưa có user object trong Redux)
  if (token && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress /> {/* Dùng spinner của MUI cho đẹp */}
      </Box>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Outlet này sẽ render PublicLayout hoặc AdminLayout tùy vào route */}
      <Outlet />
    </>
  );
}

export default App;
