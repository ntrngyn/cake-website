// src/components/layout/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box } from "@mui/material";

export default function PublicLayout() {
  return (
    // Sử dụng Box của MUI để dễ dàng quản lý layout
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      {/* main content sẽ tự động co giãn để đẩy footer xuống dưới */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
