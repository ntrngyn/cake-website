// src/pages/admin/IngredientManagementPage.tsx
import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { ingredientApi, Ingredient } from "../../api/ingredientApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IngredientFormModal from "../../components/admin/IngredientFormModal";

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
  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa loại bánh này? (Các sản phẩm thuộc loại này sẽ không bị ảnh hưởng)"
      )
    ) {
      try {
        await ingredientApi.remove(id);
        toast.success("Xóa loại bánh thành công!");
        fetchIngredients();
      } catch (error) {
        toast.error("Xóa thất bại. Có thể loại bánh này đang được sử dụng.");
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
          <IconButton onClick={() => handleDelete(params.row.idNL)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản Lý Nguyên Liệu
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleOpenCreateModal}
      >
        Thêm Nguyên Liệu Mới
      </Button>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={ingredients}
          columns={columns}
          getRowId={(row) => row.idNL}
          loading={loading}
        />
      </Box>
      <IngredientFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        ingredientToEdit={editingIngredient}
      />
    </Box>
  );
}
