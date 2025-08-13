// src/components/admin/ProductionFormModal.tsx
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { productionApi, ProductionPayload } from "../../api/productionApi";
import { cakeApi, Cake } from "../../api/cakeApi";
import { AxiosError } from "axios";

interface ProductionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Định nghĩa schema validation cho form
const schema = yup.object().shape({
  idBANH: yup
    .number()
    .typeError("Vui lòng chọn bánh")
    .required("Vui lòng chọn bánh"),
  soLuongSanXuat: yup
    .number()
    .typeError("Số lượng phải là số")
    .positive("Số lượng phải lớn hơn 0")
    .integer("Số lượng phải là số nguyên")
    .required("Vui lòng nhập số lượng"),
  hanSuDung: yup
    .string()
    .required("Vui lòng nhập hạn sử dụng")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày không hợp lệ (YYYY-MM-DD)"),
});

// Suy luận kiểu dữ liệu cho form từ schema
type FormData = yup.InferType<typeof schema>;

export default function ProductionFormModal({
  open,
  onClose,
  onSuccess,
}: ProductionFormModalProps) {
  const [cakes, setCakes] = useState<Cake[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      soLuongSanXuat: 1, // Mặc định sản xuất 1 cái
    },
  });

  // useEffect để lấy danh sách bánh và reset form khi modal được mở
  useEffect(() => {
    if (open) {
      const fetchCakes = async () => {
        try {
          const response = await cakeApi.getAll({ limit: 1000 }); // Lấy danh sách bánh
          setCakes(response.data.cakes);
        } catch (error) {
          toast.error("Không thể tải danh sách bánh.");
        }
      };
      fetchCakes();
      // Reset form về trạng thái mặc định
      reset({
        idBANH: undefined,
        soLuongSanXuat: 1,
        hanSuDung: "",
      });
    }
  }, [open, reset]);

  // Hàm xử lý khi submit form
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Đảm bảo idBANH là number trước khi gửi
      const payload: ProductionPayload = { ...data, idBANH: data.idBANH! };
      await productionApi.create(payload);
      toast.success("Tạo lô sản xuất mới thành công!");
      onSuccess(); // Báo cho trang cha biết để tải lại dữ liệu
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      // Hiển thị thông báo lỗi cụ thể từ backend
      toast.error(error.response?.data?.message || "Tạo lô sản xuất thất bại.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Tạo Lô Sản Xuất Mới</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="idBANH"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Chọn Bánh"
                select
                fullWidth
                margin="normal"
                error={!!errors.idBANH}
                helperText={errors.idBANH?.message}
              >
                {cakes.map((cake) => (
                  <MenuItem key={cake.idBANH} value={cake.idBANH}>
                    {cake.tenBANH}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="soLuongSanXuat"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Số Lượng Sản Xuất"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.soLuongSanXuat}
                helperText={errors.soLuongSanXuat?.message}
              />
            )}
          />
          <Controller
            name="hanSuDung"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hạn Sử Dụng"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                error={!!errors.hanSuDung}
                helperText={errors.hanSuDung?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Tạo Lô
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
