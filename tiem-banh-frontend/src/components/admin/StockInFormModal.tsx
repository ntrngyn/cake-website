// src/components/admin/StockInFormModal.tsx
import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { inventoryApi, StockInPayload } from "../../api/inventoryApi";
import { ingredientApi, Ingredient } from "../../api/ingredientApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const detailSchema = yup.object().shape({
  idNL: yup
    .number()
    .typeError("Vui lòng chọn")
    .required("Vui lòng chọn nguyên liệu"),
  soLuongNhap: yup
    .number()
    .typeError("Phải là số")
    .positive("Số lượng phải dương")
    .required("Vui lòng nhập số lượng"),
  donGiaNhap: yup
    .number()
    .typeError("Phải là số")
    .min(0, "Đơn giá không được âm")
    .required("Vui lòng nhập đơn giá"),
  hanSuDung: yup.string().required("Vui lòng nhập HSD"),
});

const schema = yup.object().shape({
  ghiChu: yup.string().ensure(),
  details: yup
    .array()
    .of(detailSchema)
    .min(1, "Phải có ít nhất một chi tiết nhập kho"),
});

type FormData = yup.InferType<typeof schema>;

interface StockInFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockInFormModal({
  open,
  onClose,
  onSuccess,
}: StockInFormModalProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    // --- BƯỚC 1: ĐỊNH NGHĨA DEFAULTVALUES NHẤT QUÁN ---
    defaultValues: {
      ghiChu: "",
      details: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  // useEffect để lấy dữ liệu và reset form
  useEffect(() => {
    if (open) {
      const fetchIngredients = async () => {
        try {
          const response = await ingredientApi.getAll();
          setIngredients(response.data || []);
        } catch (error) {
          toast.error("Không thể tải danh sách nguyên liệu.");
        }
      };
      fetchIngredients();
      // Reset form với một dòng mặc định
      reset({
        ghiChu: "",
        details: [
          {
            // idNL: undefined, // Không cần thiết, Yup sẽ bắt lỗi
            soLuongNhap: 1,
            donGiaNhap: 0,
            hanSuDung: "",
          },
        ],
      });
    }
  }, [open, reset]);

  // --- THAY THẾ HÀM NÀY ---
  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Định nghĩa một hàm async bên trong để xử lý logic
    const handleCreation = async () => {
      try {
        const payload: StockInPayload = { ...data, details: data.details! };
        await inventoryApi.create(payload);
        toast.success("Tạo phiếu nhập kho thành công!");
        onSuccess();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Tạo phiếu nhập thất bại."
        );
      }
    };

    // Gọi hàm async vừa tạo
    handleCreation();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Tạo Phiếu Nhập Kho Mới</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="ghiChu"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Ghi Chú" fullWidth margin="normal" />
            )}
          />
          <hr style={{ margin: "1rem 0" }} />
          <Typography variant="h6" gutterBottom>
            Chi Tiết Phiếu Nhập
          </Typography>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{ display: "flex", gap: 1.5, alignItems: "start", mb: 2 }}
            >
              <Controller
                name={`details.${index}.idNL`}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    // --- BƯỚC 2: ĐẢM BẢO VALUE KHÔNG BAO GIỜ LÀ UNDEFINED ---
                    value={controllerField.value || ""} // Luôn cung cấp một chuỗi rỗng
                    label="Nguyên Liệu"
                    select
                    sx={{ flex: 4 }}
                    error={!!errors.details?.[index]?.idNL}
                    helperText={errors.details?.[index]?.idNL?.message}
                  >
                    {ingredients.map((ing) => (
                      <MenuItem key={ing.idNL} value={ing.idNL}>
                        {ing.tenNL}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              {/* Các Controller còn lại giữ nguyên */}
              <Controller
                name={`details.${index}.soLuongNhap`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Số Lượng"
                    type="number"
                    sx={{ flex: 2 }}
                    error={!!errors.details?.[index]?.soLuongNhap}
                    helperText={errors.details?.[index]?.soLuongNhap?.message}
                  />
                )}
              />
              <Controller
                name={`details.${index}.donGiaNhap`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Đơn Giá"
                    type="number"
                    sx={{ flex: 2 }}
                    error={!!errors.details?.[index]?.donGiaNhap}
                    helperText={errors.details?.[index]?.donGiaNhap?.message}
                  />
                )}
              />
              <Controller
                name={`details.${index}.hanSuDung`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hạn Sử Dụng"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 2 }}
                    error={!!errors.details?.[index]?.hanSuDung}
                    helperText={errors.details?.[index]?.hanSuDung?.message}
                  />
                )}
              />
              <IconButton
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddCircleOutlineIcon />}
            // --- BƯỚC 3: ĐẢM BẢO APPEND NHẤT QUÁN ---
            onClick={() =>
              append({
                idNL: undefined,
                soLuongNhap: 1,
                donGiaNhap: 0,
                hanSuDung: "",
              })
            }
          >
            Thêm Dòng
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Tạo Phiếu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
