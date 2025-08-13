// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../redux/authSlice";

// MUI Components
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
  ListItemIcon,
} from "@mui/material";
// MUI Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu"; // Icon Hamburger
import ExpandLess from "@mui/icons-material/ExpandLess"; // Icon mũi tên lên
import ExpandMore from "@mui/icons-material/ExpandMore"; // Icon mũi tên xuống
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Icon cho profile
import LogoutIcon from "@mui/icons-material/Logout"; // Icon cho đăng xuất
import LoginIcon from "@mui/icons-material/Login"; // Icon cho đăng nhập
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// CSS Module
import styles from "./Navbar.module.css";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // --- SỬ DỤNG SELECTOR MỘT CÁCH TRỰC TIẾP VÀ AN TOÀN ---
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItemCount = useAppSelector((state) =>
    state.cart.cartItems.reduce((count, item) => count + item.quantity, 0)
  );

  // --- BẮT ĐẦU DEBUG ---
  console.group("--- NAVBAR RENDER ---");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user object:", user);
  console.log("user?.role:", user?.role);

  const isEmployee = user ? user.role !== "KhachHang" : false;

  console.log("Calculated isEmployee:", isEmployee);
  console.groupEnd();

  // State cho dropdown sản phẩm
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openProductMenu = Boolean(anchorEl);

  // State cho menu mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(false);

  const handleProductMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleProductMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);
  const handleMobileSubMenuToggle = (event: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan ra Box cha
    event.stopPropagation();
    setMobileSubMenuOpen(!mobileSubMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userName = user ? user.hotenKH || user.hotenNV : "";

  // --- JSX CHO MENU TRÊN MOBILE (DRAWER) ---
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <RouterLink
        to="/"
        className={styles.logo}
        style={{ padding: "1rem 0", display: "block" }}
      >
        Sweet & Savory
      </RouterLink>
      <Divider />
      <List>
        {/* --- SỬA LẠI MỤC SẢN PHẨM --- */}
        <ListItemButton onClick={handleMobileSubMenuToggle}>
          <ListItemText primary="Sản Phẩm" />
          {mobileSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={mobileSubMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Các mục con được thụt vào trong */}
            <ListItemButton
              sx={{ pl: 4 }}
              component={RouterLink}
              to="/products?category=1"
            >
              <ListItemText primary="Bánh Kem" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={RouterLink}
              to="/products?category=2"
            >
              <ListItemText primary="Bánh Quy" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={RouterLink}
              to="/products?category=3"
            >
              <ListItemText primary="Bánh Ngọt" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={RouterLink}
              to="/products?category=4"
            >
              <ListItemText primary="Bánh Nướng" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={RouterLink}
              to="/products"
            >
              <ListItemText primary="Xem Tất Cả" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/about">
            <ListItemText primary="Về Chúng Tôi" />
          </ListItemButton>
        </ListItem>
        {isEmployee && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/admin">
              <ListItemText primary="Quản Trị" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* --- THÊM PHẦN XỬ LÝ AUTH VÀO ĐÂY --- */}
      <Divider />
      <List>
        {isAuthenticated ? (
          // Nếu đã đăng nhập
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/profile">
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={`Chào, ${userName}`} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng Xuất" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          // Nếu chưa đăng nhập
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng Nhập" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng Ký" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "white" }}>
        <Toolbar
          sx={{
            minHeight: { xs: "80px", md: "96px" },
            paddingX: { xs: 2, md: "5%" },
          }}
        >
          {/* Nút Hamburger cho Mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            className={styles.logo}
            sx={{ flexGrow: { xs: 1, md: 0 } }} // Trên mobile, logo chiếm hết không gian
          >
            Sweet & Savory
          </Typography>

          {/* Menu cho Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              width: "100%",
              alignItems: "center",
            }}
          >
            {/* Các link bên trái */}
            <Box sx={{ flexGrow: 1, marginLeft: 4 }}>
              <Button
                color="inherit"
                onClick={handleProductMenuClick} /* ... */
              >
                Sản Phẩm
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openProductMenu}
                onClose={handleProductMenuClose}
              >
                <MenuItem
                  onClick={handleProductMenuClose}
                  component={RouterLink}
                  to="/products?category=1"
                >
                  Bánh Kem
                </MenuItem>
                <MenuItem
                  onClick={handleProductMenuClose}
                  component={RouterLink}
                  to="/products?category=2"
                >
                  Bánh Quy
                </MenuItem>
                <MenuItem
                  onClick={handleProductMenuClose}
                  component={RouterLink}
                  to="/products?category=3"
                >
                  Bánh Ngọt
                </MenuItem>
                <MenuItem
                  onClick={handleProductMenuClose}
                  component={RouterLink}
                  to="/products?category=4"
                >
                  Bánh Nướng
                </MenuItem>
                <MenuItem
                  onClick={handleProductMenuClose}
                  component={RouterLink}
                  to="/products"
                >
                  Xem Tất Cả
                </MenuItem>
              </Menu>
              <Button
                component={RouterLink}
                to="/about"
                color="inherit"
                className={styles.navLink}
              >
                Về Chúng Tôi
              </Button>
              {isEmployee && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  color="inherit"
                  className={styles.navLink}
                >
                  Quản Trị
                </Button>
              )}
            </Box>

            {/* Các nút bên phải */}
            {!isEmployee && (
              <IconButton
                component={RouterLink}
                to="/cart"
                className={styles.iconButton}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/profile"
                    color="primary"
                    variant="text"
                  >
                    Chào, {userName}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    color="primary"
                  >
                    Đăng Xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    className={styles.navLink}
                  >
                    Đăng Nhập
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                  >
                    Đăng Ký
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {!isEmployee && (
              <IconButton component={RouterLink} to="/cart" /* ... */>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Component Drawer cho Mobile Menu */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
