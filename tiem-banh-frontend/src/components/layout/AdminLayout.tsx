// src/components/layout/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
// --- THÊM IMPORT useAppSelector ---
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// MUI Components
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CakeIcon from "@mui/icons-material/Cake";
import CategoryIcon from "@mui/icons-material/Category";
import ScienceIcon from "@mui/icons-material/Science";
import InventoryIcon from "@mui/icons-material/Inventory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const drawerWidth = 240;

// Danh sách TẤT CẢ các mục menu có thể có
const allMenuItems = [
  {
    text: "Dashboard",
    path: ".",
    icon: <DashboardIcon />,
    allowedRoles: ["Admin", "Quản lý"],
  },
  {
    text: "Quản lý Đơn hàng",
    path: "orders",
    icon: <ShoppingCartIcon />,
    allowedRoles: ["Admin", "Quản lý", "NhanVien"],
  },
  {
    text: "Quản lý Sản phẩm",
    path: "products",
    icon: <CakeIcon />,
    allowedRoles: ["Admin", "Quản lý", "NhanVien"],
  },
  {
    text: "Quản lý Loại bánh",
    path: "categories",
    icon: <CategoryIcon />,
    allowedRoles: ["Admin", "Quản lý"],
  },
  {
    text: "Quản lý Nguyên liệu",
    path: "ingredients",
    icon: <ScienceIcon />,
    allowedRoles: ["Admin", "Quản lý kho"],
  },
  {
    text: "Quản lý Nhập kho",
    path: "inventory",
    icon: <InventoryIcon />,
    allowedRoles: ["Admin", "Quản lý kho"],
  },
  {
    text: "Quản lý Sản xuất",
    path: "production",
    icon: <PrecisionManufacturingIcon />,
    allowedRoles: ["Admin", "Thợ làm bánh"],
  },
  {
    text: "Quản lý Tài khoản",
    path: "users",
    icon: <ManageAccountsIcon />,
    allowedRoles: ["Admin"],
  },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // --- BƯỚC 1: LẤY THÔNG TIN USER TỪ REDUX STORE ---
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  // --- BƯỚC 2: LỌC RA CÁC MỤC MENU MÀ USER CÓ QUYỀN TRUY CẬP ---
  const accessibleMenuItems = allMenuItems.filter(
    (item) =>
      // Kiểm tra xem user có tồn tại, có vai trò, và vai trò đó có trong danh sách được phép không
      user?.role && item.allowedRoles.includes(user.role)
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Header (Giữ nguyên) */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Trang Quản Trị Tiệm Bánh
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* BƯỚC 3: SỬ DỤNG MẢNG ĐÃ ĐƯỢC LỌC ĐỂ RENDER */}
            {accessibleMenuItems.map((item) => (
              <NavLink
                key={item.text}
                to={item.path}
                end={item.path === "."}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {({ isActive }) => (
                  <ListItem disablePadding>
                    <ListItemButton selected={isActive}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                )}
              </NavLink>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Vùng nội dung chính (Giữ nguyên) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
