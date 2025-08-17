// src/pages/admin/IngredientManagementPage.tsx
import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { ingredientApi, Ingredient } from "../../api/ingredientApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IngredientFormModal from "../../components/admin/IngredientFormModal";
import AddIcon from "@mui/icons-material/Add";

export default function IngredientManagementPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await ingredientApi.getAll();
      setIngredients(response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách loại bánh.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIngredients();
  }, []);
  // Phiên bản đã được sửa lỗi
  const handleDelete = async (id: number, name: string) => {
    // Sử dụng tên nguyên liệu trong thông điệp xác nhận
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa nguyên liệu "${name}"?\nHành động này không thể hoàn tác.`
      )
    ) {
      try {
        await ingredientApi.remove(id);
        toast.success(`Xóa nguyên liệu "${name}" thành công!`);
        fetchIngredients();
      } catch (error: any) {
        // Hiển thị lỗi cụ thể từ backend nếu có
        const errorMessage =
          error.response?.data?.message ||
          "Xóa thất bại. Có thể nguyên liệu này đang được sử dụng trong một công thức.";
        toast.error(errorMessage);
      }
    }
  };
  const handleOpenCreateModal = () => {
    setEditingIngredient(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    handleCloseModal();
    fetchIngredients();
  };

  const columns: GridColDef<Ingredient>[] = [
    { field: "idNL", headerName: "ID", width: 90 },
    { field: "tenNL", headerName: "Tên Nguyên Liệu", flex: 1 },
    { field: "donviNL", headerName: "Đơn Vị Tính", width: 150 },
    {
      field: "soluongtonNL",
      headerName: "Tồn Kho Hiện Tại",
      type: "number",
      width: 180,
    },
    {
      field: "soluongtontoithieuNL",
      headerName: "Tồn Kho Tối Thiểu",
      type: "number",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Ingredient>) => (
        <>
          <IconButton onClick={() => handleOpenEditModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.idNL, params.row.tenNL)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    // SỬ DỤNG <Paper> LÀM COMPONENT BAO BỌC NGOÀI CÙNG
    <Paper sx={{ p: 3, width: "100%" }}>
      {/* Tiêu đề và nút bấm được nhóm riêng */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Quản Lý Nguyên Liệu
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Thêm Nguyên Liệu Mới
        </Button>
      </Box>

      {/* Bảng dữ liệu được đặt trong một Box có chiều cao cố định */}
      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={ingredients}
          columns={columns}
          getRowId={(row) => row.idNL}
          loading={loading}
        />
      </Box>

      {/* Modal không nằm trong Paper, nó sẽ hiển thị đè lên trên */}
      <IngredientFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        ingredientToEdit={editingIngredient}
      />
    </Paper>
  );
}
