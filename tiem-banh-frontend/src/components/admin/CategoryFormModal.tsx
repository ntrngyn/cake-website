// src/components/admin/CategoryFormModal.tsx
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
import { categoryApi, Category } from "../../api/categoryApi";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit: Category | null;
}

type CategoryFormData = {
  tenLOAIBANH: string;
};

const schema = yup.object().shape({
  tenLOAIBANH: yup.string().required("Tên loại bánh không được để trống"),
});

export default function CategoryFormModal({
  open,
  onClose,
  onSuccess,
  categoryToEdit,
}: CategoryFormModalProps) {
  const isEditMode = !!categoryToEdit;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: { tenLOAIBANH: "" },
  });

  useEffect(() => {
    if (categoryToEdit) {
      reset({ tenLOAIBANH: categoryToEdit.tenLOAIBANH });
    } else {
      reset({ tenLOAIBANH: "" });
    }
  }, [categoryToEdit, reset, open]);

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      if (isEditMode && categoryToEdit) {
        await categoryApi.update(categoryToEdit.idLB, data);
        toast.success("Cập nhật loại bánh thành công!");
      } else {
        await categoryApi.create(data);
        toast.success("Thêm loại bánh mới thành công!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {isEditMode ? "Chỉnh Sửa Loại Bánh" : "Thêm Loại Bánh Mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="tenLOAIBANH"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Tên Loại Bánh"
                variant="outlined"
                margin="normal"
                fullWidth
                error={!!errors.tenLOAIBANH}
                helperText={errors.tenLOAIBANH?.message}
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
