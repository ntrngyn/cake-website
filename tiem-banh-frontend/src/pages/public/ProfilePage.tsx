// src/pages/public/ProfilePage.tsx
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import { useAppSelector } from "../../hooks/useRedux";

// Hàm để ánh xạ path sang giá trị của Tab
const pathToTab = (path: string) => {
  if (path.endsWith("/orders")) return "orders";
  return "account"; // Mặc định là tab 'account'
};

export default function ProfilePage() {
  const location = useLocation();
  const currentTab = pathToTab(location.pathname);

  const { user } = useAppSelector((state) => state.auth);
  const isCustomer = user?.role === "KhachHang";

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontFamily: "'Playfair Display', serif" }}
      >
        Tài Khoản Của Tôi
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={currentTab}>
          <Tab
            label="Thông tin tài khoản"
            value="account"
            component={NavLink}
            to="/profile"
            end
          />

          {isCustomer && (
            <Tab
              label="Lịch sử đơn hàng"
              value="orders"
              component={NavLink}
              to="/profile/orders"
            />
          )}
        </Tabs>
      </Box>

      {/* Nội dung của tab được chọn sẽ hiển thị ở đây */}
      <Outlet />
    </Container>
  );
}
