// src/pages/public/RegisterPage.tsx
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { registerUser } from "../../redux/authSlice";
import styles from "../../styles/Form.module.css"; // Sử dụng lại CSS Module chung

// MUI Components
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
} from "@mui/material";

// Kiểu dữ liệu cho form
type RegisterFormInputs = {
  hotenKH: string;
  emailKH: string;
  taikhoanKH: string;
  matkhauKH: string;
  confirmPassword?: string; // Thêm trường xác nhận mật khẩu
};

// Cập nhật schema validation
const schema = yup.object().shape({
  hotenKH: yup.string().required("Họ tên không được để trống"),
  emailKH: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  taikhoanKH: yup
    .string()
    .min(3, "Tài khoản phải có ít nhất 3 ký tự")
    .required("Tài khoản không được để trống"),
  matkhauKH: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("matkhauKH")], "Mật khẩu xác nhận không khớp"),
});

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      hotenKH: "",
      emailKH: "",
      taikhoanKH: "",
      matkhauKH: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    dispatch(registerUser(data))
      .unwrap()
      .then(() => {
        toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        navigate("/login");
      })
      .catch((error) => {
        toast.error(`Đăng ký thất bại: ${error}`);
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
          Tạo Tài Khoản Mới
        </Typography>

        <Controller
          name="hotenKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Họ và Tên"
              fullWidth
              margin="normal"
              error={!!errors.hotenKH}
              helperText={errors.hotenKH?.message}
            />
          )}
        />
        <Controller
          name="emailKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.emailKH}
              helperText={errors.emailKH?.message}
            />
          )}
        />
        <Controller
          name="taikhoanKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tên tài khoản"
              fullWidth
              margin="normal"
              error={!!errors.taikhoanKH}
              helperText={errors.taikhoanKH?.message}
            />
          )}
        />
        <Controller
          name="matkhauKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Mật khẩu"
              fullWidth
              margin="normal"
              error={!!errors.matkhauKH}
              helperText={errors.matkhauKH?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Xác nhận mật khẩu"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
          {loading === "pending" ? "Đang xử lý..." : "Đăng Ký"}
        </Button>

        <Typography className={styles.footerText}>
          Đã có tài khoản?{" "}
          <Link
            component={RouterLink}
            to="/login"
            className={styles.footerLink}
          >
            Đăng nhập ngay
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
