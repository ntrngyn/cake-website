// src/pages/public/AccountInfoPage.tsx
import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { userApi } from "../../api/userApi";
import { updateUser } from "../../redux/authSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// MUI Components
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

// Kiểu dữ liệu cho form
type ProfileFormInputs = {
  hotenKH: string;
  sdtKH: string;
  diachiKH: string;
};

// Schema validation
const schema = yup.object().shape({
  hotenKH: yup.string().required("Họ tên không được để trống"),
  sdtKH: yup.string(),
  diachiKH: yup.string(),
});

export default function AccountInfoPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInputs>({
    resolver: yupResolver(schema),
  });

  // useEffect này bây giờ sẽ hoạt động đúng
  useEffect(() => {
    if (user) {
      reset({
        hotenKH: user.hotenKH || "",
        sdtKH: user.sdtKH || "",
        diachiKH: user.diachiKH || "",
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    try {
      const response = await userApi.updateProfile(data);
      // Dispatch action 'updateUser' với dữ liệu mới từ API
      dispatch(updateUser(response.data));
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  // Nếu user không phải khách hàng (ví dụ: admin), hiển thị thông báo khác
  if (user && user.role !== "KhachHang") {
    return (
      <Box component={Paper} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Thông Tin Tài Khoản
        </Typography>
        <Typography>Họ tên: {user.hotenNV}</Typography>
        <Typography>Email: {user.emailNV}</Typography>
        <Typography>Vai trò: {user.role}</Typography>
      </Box>
    );
  }

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Thông Tin Tài Khoản
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Trường Tài khoản (chỉ đọc) */}
        <TextField
          label="Tên tài khoản"
          value={user?.taikhoanKH || ""}
          disabled
          fullWidth
          margin="normal"
        />
        {/* Trường Email (chỉ đọc) */}
        <TextField
          label="Email"
          value={user?.emailKH || ""}
          disabled
          fullWidth
          margin="normal"
        />
        {/* Form cập nhật thông tin */}
        <Controller
          name="hotenKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Họ tên"
              fullWidth
              margin="normal"
              error={!!errors.hotenKH}
              helperText={errors.hotenKH?.message}
            />
          )}
        />
        <Controller
          name="sdtKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Số điện thoại"
              fullWidth
              margin="normal"
              error={!!errors.sdtKH}
              helperText={errors.sdtKH?.message}
            />
          )}
        />
        <Controller
          name="diachiKH"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Địa chỉ"
              fullWidth
              margin="normal"
              error={!!errors.diachiKH}
              helperText={errors.diachiKH?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
        </Button>
      </form>
    </Box>
  );
}
