// src/components/admin/IngredientFormModal.tsx
import { useEffect } from "react";
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
} from "@mui/material";
import {
  ingredientApi,
  Ingredient,
  IngredientPayload,
} from "../../api/ingredientApi";

interface IngredientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ingredientToEdit: Ingredient | null;
}

const schema = yup.object().shape({
  tenNL: yup.string().required("Tên nguyên liệu không được để trống"),
  donviNL: yup.string().required("Đơn vị tính không được để trống"),
  soluongtontoithieuNL: yup
    .number()
    .min(0, "Số lượng không được âm")
    .typeError("Phải là một con số"),
});

type FormData = yup.InferType<typeof schema>;

export default function IngredientFormModal({
  open,
  onClose,
  onSuccess,
  ingredientToEdit,
}: IngredientFormModalProps) {
  const isEditMode = !!ingredientToEdit;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) {
      if (ingredientToEdit) {
        reset({
          tenNL: ingredientToEdit.tenNL,
          donviNL: ingredientToEdit.donviNL,
          soluongtontoithieuNL: ingredientToEdit.soluongtontoithieuNL,
        });
      } else {
        reset({ tenNL: "", donviNL: "", soluongtontoithieuNL: 0 });
      }
    }
  }, [ingredientToEdit, open, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const payload: IngredientPayload = { ...data };
      if (isEditMode && ingredientToEdit) {
        await ingredientApi.update(ingredientToEdit.idNL, payload);
        toast.success("Cập nhật nguyên liệu thành công!");
      } else {
        await ingredientApi.create(payload);
        toast.success("Thêm nguyên liệu mới thành công!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {isEditMode ? "Chỉnh Sửa Nguyên Liệu" : "Thêm Nguyên Liệu Mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="tenNL"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Tên Nguyên Liệu"
                fullWidth
                margin="normal"
                error={!!errors.tenNL}
                helperText={errors.tenNL?.message}
              />
            )}
          />
          <Controller
            name="donviNL"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Đơn Vị Tính"
                fullWidth
                margin="normal"
                error={!!errors.donviNL}
                helperText={errors.donviNL?.message}
              />
            )}
          />
          <Controller
            name="soluongtontoithieuNL"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tồn Kho Tối Thiểu"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.soluongtontoithieuNL}
                helperText={errors.soluongtontoithieuNL?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
