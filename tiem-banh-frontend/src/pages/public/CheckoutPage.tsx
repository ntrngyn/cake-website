// src/pages/public/CheckoutPage.tsx
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderApi } from "../../api/orderApi";
import { clearCart } from "../../redux/cartSlice";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI Components
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";

// Định nghĩa kiểu dữ liệu cho form thanh toán
type CheckoutFormInputs = {
  hoTen: string;
  soDienThoai: string;
  diaChi: string;
  ghiChu?: string;
};

// Tạo schema validation
const schema = yup.object().shape({
  hoTen: yup.string().required("Họ tên không được để trống"),
  soDienThoai: yup.string().required("Số điện thoại không được để trống"),
  diaChi: yup.string().required("Địa chỉ không được để trống"),
  ghiChu: yup.string().optional(),
});

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormInputs>({
    resolver: yupResolver(schema),
    // Lấy giá trị mặc định từ thông tin user đã đăng nhập
    defaultValues: {
      hoTen: user?.hotenKH || "",
      soDienThoai: user?.sdtKH || "",
      diaChi: user?.diachiKH || "",
      ghiChu: "",
    },
  });

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.giaBANH * item.quantity,
    0
  );

  const onSubmit: SubmitHandler<CheckoutFormInputs> = async (formData) => {
    setIsPlacingOrder(true);
    try {
      const formattedItems = cartItems.map((item) => ({
        idBANH: item.idBANH,
        soluong: item.quantity,
      }));

      // Sau này, bạn có thể gửi cả formData (thông tin giao hàng) lên backend
      // await orderApi.create({ items: formattedItems, shippingInfo: formData });
      await orderApi.create({ items: formattedItems });

      dispatch(clearCart());
      toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
      navigate("/profile/orders");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Nếu giỏ hàng trống, điều hướng người dùng về trang sản phẩm
  if (cartItems.length === 0 && !isPlacingOrder) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontFamily: "'Playfair Display', serif", textAlign: "center" }}
      >
        Hoàn Tất Đơn Hàng
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Cột form thông tin */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Thông Tin Giao Hàng
              </Typography>
              <Controller
                name="hoTen"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ tên người nhận"
                    fullWidth
                    margin="normal"
                    error={!!errors.hoTen}
                    helperText={errors.hoTen?.message}
                  />
                )}
              />
              <Controller
                name="soDienThoai"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Số điện thoại"
                    fullWidth
                    margin="normal"
                    error={!!errors.soDienThoai}
                    helperText={errors.soDienThoai?.message}
                  />
                )}
              />
              <Controller
                name="diaChi"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Địa chỉ giao hàng"
                    fullWidth
                    margin="normal"
                    error={!!errors.diaChi}
                    helperText={errors.diaChi?.message}
                  />
                )}
              />
              <Controller
                name="ghiChu"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ghi chú (tùy chọn)"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                  />
                )}
              />
            </Paper>
          </Grid>

          {/* Cột tóm tắt đơn hàng */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{ p: 3, position: "sticky", top: "100px" }}
            >
              <Typography variant="h5" gutterBottom>
                Đơn Hàng Của Bạn
              </Typography>
              {cartItems.map((item) => (
                <Box
                  key={item.idBANH}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    my: 1,
                  }}
                >
                  <Typography>
                    {item.tenBANH} x {item.quantity}
                  </Typography>
                  <Typography>
                    {new Intl.NumberFormat("vi-VN").format(
                      item.giaBANH * item.quantity
                    )}{" "}
                    đ
                  </Typography>
                </Box>
              ))}
              <hr />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  mt: 2,
                }}
              >
                <Typography variant="h6">Tổng Cộng</Typography>
                <Typography variant="h6" color="primary">
                  {new Intl.NumberFormat("vi-VN").format(cartTotal)} VND
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isPlacingOrder}
                sx={{ mt: 3 }}
              >
                {isPlacingOrder ? "Đang xử lý..." : "XÁC NHẬN ĐẶT HÀNG"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
