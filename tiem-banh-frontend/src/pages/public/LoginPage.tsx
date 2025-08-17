// src/pages/public/LoginPage.tsx
import { useForm, SubmitHandler, Controller } from "react-hook-form"; // Thêm Controller
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { loginUser, User } from "../../redux/authSlice";
import styles from "../../styles/Form.module.css"; // Import CSS Module chung

// MUI Components
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";

// Kiểu dữ liệu và schema (giữ nguyên)
type LoginFormInputs = {
  email: string;
  matkhau: string;
};
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  matkhau: yup.string().required("Mật khẩu không được để trống"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const {
    control, // Sử dụng control để kết nối với Controller
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      matkhau: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    // data ở đây có dạng: { email: "...", matkhau: "..." }

    // BƯỚC 1: Tạo một đối tượng mới với tên trường mà backend mong đợi
    const credentials = {
      taikhoan: data.email, // "Dịch" 'email' thành 'taikhoan'
      matkhau: data.matkhau,
    };

    // BƯỚC 2: Gửi đối tượng đã được "dịch" đi
    dispatch(loginUser(credentials))
      .unwrap()
      .then((result) => {
        const user = result.user as User;
        toast.success(
          `Đăng nhập thành công! Chào mừng ${
            user.hotenNV || user.hotenKH || ""
          }`
        );

        if (user.role && user.role !== "KhachHang") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((errorMessage) => {
        toast.error(`Đăng nhập thất bại: ${errorMessage}`);
      });
  };

  return (
    <Container className={styles.container}>
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.formWrapper}
        elevation={3}
      >
        <Typography variant="h4" component="h1" className={styles.title}>
          Đăng Nhập
        </Typography>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.eamil?.message}
            />
          )}
        />

        <Controller
          name="matkhau"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Mật khẩu"
              fullWidth
              margin="normal"
              error={!!errors.matkhau}
              helperText={errors.matkhau?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading === "pending"}
          className={styles.submitButton}
        >
          {loading === "pending" ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>

        <Typography className={styles.footerText}>
          Chưa có tài khoản?{" "}
          <Link
            component={RouterLink}
            to="/register"
            className={styles.footerLink}
          >
            Đăng ký ngay
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
