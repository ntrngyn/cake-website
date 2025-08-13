// src/components/layout/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useRedux";
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
import CategoryIcon from "@mui/icons-material/Category"; // Thêm icon
import ScienceIcon from "@mui/icons-material/Science"; // Thêm icon
import InventoryIcon from "@mui/icons-material/Inventory"; // Thêm icon
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing"; // Thêm icon

const drawerWidth = 240;

// Danh sách các mục menu
const menuItems = [
  // Sử dụng '.' để trỏ đến index route của layout cha
  { text: "Dashboard", path: ".", icon: <DashboardIcon /> },
  // Sử dụng đường dẫn tương đối (không có / ở đầu)
  { text: "Quản lý Đơn hàng", path: "orders", icon: <ShoppingCartIcon /> },
  { text: "Quản lý Sản phẩm", path: "products", icon: <CakeIcon /> },
  { text: "Quản lý Loại bánh", path: "categories", icon: <CategoryIcon /> },
  { text: "Quản lý Nguyên liệu", path: "ingredients", icon: <ScienceIcon /> },
  { text: "Quản lý Nhập kho", path: "inventory", icon: <InventoryIcon /> },
  {
    text: "Quản lý Sản xuất",
    path: "production",
    icon: <PrecisionManufacturingIcon />,
  },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Header */}
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
            {menuItems.map((item) => (
              // BƯỚC 1: BỌC ListItem BẰNG NavLink
              <NavLink
                key={item.text}
                to={item.path}
                end={item.path === "."} // end=true cho index route
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {(
                  { isActive } // <-- NavLink cung cấp isActive qua render prop
                ) => (
                  <ListItem disablePadding>
                    <ListItemButton selected={isActive}>
                      {" "}
                      {/* <-- SỬ DỤNG PROP 'selected' */}
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

      {/* Vùng nội dung chính */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* Đây là nơi nội dung của các trang con sẽ được hiển thị */}
        <Outlet />
      </Box>
    </Box>
  );
}
