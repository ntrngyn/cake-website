// src/pages/admin/CategoryManagementPage.tsx
import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { categoryApi, Category } from "../../api/categoryApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryFormModal from "../../components/admin/CategoryFormModal";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách loại bánh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa loại bánh này? (Các sản phẩm thuộc loại này sẽ không bị ảnh hưởng)"
      )
    ) {
      try {
        await categoryApi.remove(id);
        toast.success("Xóa loại bánh thành công!");
        fetchCategories();
      } catch (error) {
        toast.error("Xóa thất bại. Có thể loại bánh này đang được sử dụng.");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    handleCloseModal();
    fetchCategories();
  };

  const columns: GridColDef<Category>[] = [
    { field: "idLB", headerName: "ID", width: 90 },
    { field: "tenLOAIBANH", headerName: "Tên Loại Bánh", flex: 1 },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Category>) => (
        <>
          <IconButton onClick={() => handleOpenEditModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.idLB)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản Lý Loại Bánh
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleOpenCreateModal}
      >
        Thêm Loại Bánh Mới
      </Button>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={categories}
          columns={columns}
          getRowId={(row) => row.idLB}
          loading={loading}
        />
      </Box>
      <CategoryFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        categoryToEdit={editingCategory}
      />
    </Box>
  );
}
