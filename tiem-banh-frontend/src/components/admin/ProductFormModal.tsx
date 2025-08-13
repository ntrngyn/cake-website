// src/components/admin/ProductFormModal.tsx
import { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
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
import { cakeApi, Cake, CakePayload } from "../../api/cakeApi";
import { categoryApi, Category } from "../../api/categoryApi";
import { ingredientApi, Ingredient } from "../../api/ingredientApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

// Suy luận kiểu từ schema để đảm bảo nhất quán
const schema = yup.object().shape({
  tenBANH: yup.string().required("Tên bánh không được để trống"),
  giaBANH: yup
    .number()
    .typeError("Giá phải là số")
    .min(0)
    .required("Giá bánh không được để trống"),
  motaBANH: yup.string().ensure(),
  idLB: yup
    .number()
    .typeError("Vui lòng chọn loại bánh")
    .required("Vui lòng chọn loại bánh"),
  congthuc: yup
    .array()
    .of(
      yup.object().shape({
        idNL: yup
          .number()
          .typeError("Vui lòng chọn nguyên liệu")
          .required("Vui lòng chọn nguyên liệu"),
        soluong: yup
          .number()
          .typeError("Số lượng phải là số")
          .positive("Số lượng phải dương")
          .required("Vui lòng nhập số lượng"),
        donvi: yup.string().required("Vui lòng nhập đơn vị"),
      })
    )
    .min(1, "Phải có ít nhất một nguyên liệu trong công thức")
    .required(),
});

type ProductFormData = yup.InferType<typeof schema>;

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cakeToEdit: Cake | null;
}

export default function ProductFormModal({
  open,
  onClose,
  onSuccess,
  cakeToEdit,
}: ProductFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const isEditMode = !!cakeToEdit;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tenBANH: "",
      giaBANH: 0,
      motaBANH: "",
      congthuc: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "congthuc",
  });

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [catRes, ingRes] = await Promise.all([
            categoryApi.getAll(),
            ingredientApi.getAll(),
          ]);
          setCategories(catRes.data || []);
          setIngredients(ingRes.data || []); // Sửa lỗi: chỉ cần .data
        } catch (error) {
          toast.error("Không thể tải dữ liệu cần thiết.");
        }
      };
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (isEditMode && cakeToEdit) {
        const fetchCakeDetails = async () => {
          try {
            const response = await cakeApi.getById(cakeToEdit.idBANH);
            const detailedCake = response.data as any; // Tạm dùng 'any' để truy cập cấu trúc phức tạp

            const recipeForForm =
              detailedCake.NguyenLieus?.map((ing: any) => ({
                idNL: ing.idNL, // Truy cập idNL trực tiếp
                soluong: ing.CongThuc.soluong,
                donvi: ing.CongThuc.donvi,
              })) || [];

            reset({
              tenBANH: detailedCake.tenBANH,
              giaBANH: detailedCake.giaBANH,
              motaBANH: detailedCake.motaBANH || "",
              idLB: detailedCake.idLB,
              congthuc:
                recipeForForm.length > 0
                  ? recipeForForm
                  : [{ idNL: undefined, soluong: 0, donvi: "" }],
            });
          } catch (error) {
            toast.error("Không thể tải chi tiết sản phẩm để sửa.");
            onClose();
          }
        };
        fetchCakeDetails();
      } else {
        reset({
          tenBANH: "",
          giaBANH: 0,
          motaBANH: "",
          idLB: undefined,
          congthuc: [{ idNL: undefined, soluong: 0, donvi: "" }],
        });
      }
    }
  }, [cakeToEdit, isEditMode, open, reset, onClose]);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      const payload: CakePayload = {
        ...data,
        congthuc: data.congthuc.map((c) => ({ ...c, idNL: c.idNL! })),
      };

      if (isEditMode && cakeToEdit) {
        await cakeApi.update(cakeToEdit.idBANH, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await cakeApi.create(payload);
        toast.success("Thêm sản phẩm mới thành công!");
      }
      onSuccess();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditMode ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="tenBANH"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên Bánh"
                fullWidth
                margin="normal"
                error={!!errors.tenBANH}
                helperText={errors.tenBANH?.message}
              />
            )}
          />
          <Controller
            name="giaBANH"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Giá Bán"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.giaBANH}
                helperText={errors.giaBANH?.message}
              />
            )}
          />
          <Controller
            name="idLB"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Loại Bánh"
                select
                fullWidth
                margin="normal"
                error={!!errors.idLB}
                helperText={errors.idLB?.message}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.idLB} value={cat.idLB}>
                    {cat.tenLOAIBANH}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="motaBANH"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mô tả"
                multiline
                rows={3}
                fullWidth
                margin="normal"
              />
            )}
          />
          <hr style={{ margin: "2rem 0" }} />
          <Typography variant="h6">Công Thức</Typography>
          {errors.congthuc && (
            <Typography color="error" variant="caption">
              {errors.congthuc.message}
            </Typography>
          )}

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{ display: "flex", gap: 1.5, alignItems: "start", mb: 2 }}
            >
              <Controller
                name={`congthuc.${index}.idNL`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nguyên Liệu"
                    select
                    sx={{ flex: 4 }}
                    error={!!errors.congthuc?.[index]?.idNL}
                    helperText={errors.congthuc?.[index]?.idNL?.message}
                  >
                    {ingredients.map((ing) => (
                      <MenuItem key={ing.idNL} value={ing.idNL}>
                        {ing.tenNL}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name={`congthuc.${index}.soluong`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Số Lượng"
                    type="number"
                    sx={{ flex: 2 }}
                    error={!!errors.congthuc?.[index]?.soluong}
                    helperText={errors.congthuc?.[index]?.soluong?.message}
                  />
                )}
              />
              <Controller
                name={`congthuc.${index}.donvi`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Đơn Vị"
                    sx={{ flex: 2 }}
                    error={!!errors.congthuc?.[index]?.donvi}
                    helperText={errors.congthuc?.[index]?.donvi?.message}
                  />
                )}
              />
              <IconButton
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                sx={{ mt: 1 }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => append({ idNL: undefined, soluong: 0, donvi: "" })}
          >
            Thêm Nguyên Liệu
          </Button>
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
