// src/pages/public/CartPage.tsx
import { Link as RouterLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/cartSlice";
import { getCategoryFolder } from "../../utils/imageUtils";

// MUI Components
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.giaBANH * item.quantity,
    0
  );

  const handleQuantityChange = (idBANH: number, newQuantity: number) => {
    dispatch(updateQuantity({ idBANH, quantity: Math.max(1, newQuantity) }));
  };

  const handleRemoveItem = (idBANH: number) => {
    dispatch(removeFromCart({ idBANH }));
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?")) {
      dispatch(clearCart());
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" gutterBottom>
          Giỏ Hàng Của Bạn Trống
        </Typography>
        <Button component={RouterLink} to="/products" variant="contained">
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontFamily: "'Playfair Display', serif" }}
      >
        Giỏ Hàng Của Bạn
      </Typography>

      <Grid container spacing={4}>
        {/* Cột danh sách sản phẩm */}
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => {
            // --- BƯỚC 2: TẠO ĐƯỜNG DẪN ẢNH ĐỘNG CHO MỖI ITEM ---
            const categoryFolder = getCategoryFolder(
              item.LoaiBanh?.tenLOAIBANH
            );
            const imageUrl = `/images/products/${categoryFolder}/${item.hinhanhBANH}`;

            return (
              <Paper
                key={item.idBANH}
                elevation={2}
                sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={item.tenBANH}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://via.placeholder.com/100";
                  }}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    mr: 2,
                    borderRadius: 1,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.tenBANH}</Typography>
                  <Typography color="text.secondary">
                    {new Intl.NumberFormat("vi-VN").format(item.giaBANH)} VND
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.idBANH,
                        parseInt(e.target.value, 10)
                      )
                    }
                    InputProps={{
                      inputProps: { min: 1, style: { textAlign: "center" } },
                    }}
                    sx={{ width: "70px" }}
                  />
                </Box>
                <Typography
                  sx={{
                    width: "120px",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {new Intl.NumberFormat("vi-VN").format(
                    item.giaBANH * item.quantity
                  )}{" "}
                  VND
                </Typography>
                <IconButton
                  onClick={() => handleRemoveItem(item.idBANH)}
                  sx={{ ml: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            );
          })}
          <Button onClick={handleClearCart} color="error" sx={{ mt: 2 }}>
            Xóa tất cả
          </Button>
        </Grid>

        {/* Cột tóm tắt đơn hàng */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Tóm Tắt Đơn Hàng
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 2 }}
            >
              <Typography>Tạm tính</Typography>
              <Typography>
                {new Intl.NumberFormat("vi-VN").format(cartTotal)} VND
              </Typography>
            </Box>
            <hr />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                my: 2,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary">
                {new Intl.NumberFormat("vi-VN").format(cartTotal)} VND
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to={isAuthenticated ? "/checkout" : "/login"}
              variant="contained"
              size="large"
              fullWidth
            >
              {isAuthenticated
                ? "Tiến hành thanh toán"
                : "Đăng nhập để thanh toán"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
