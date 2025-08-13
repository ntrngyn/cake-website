// src/pages/admin/ProductManagementPage.tsx
import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { cakeApi, Cake } from "../../api/cakeApi";
import { AxiosError } from "axios";

// MUI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// BƯỚC 1: IMPORT MODAL
import ProductFormModal from "../../components/admin/ProductFormModal";

export default function ProductManagementPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(false);

  // BƯỚC 2: TẠO CÁC STATE ĐỂ QUẢN LÝ MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);

  const fetchCakes = async () => {
    setLoading(true);
    try {
      const response = await cakeApi.getAll({ limit: 100 });
      setCakes(response.data.cakes);
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message || "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await cakeApi.remove(id);
        toast.success("Xóa sản phẩm thành công!");
        fetchCakes();
      } catch (err) {
        const error = err as AxiosError;
        toast.error(error.message || "Xóa sản phẩm thất bại.");
      }
    }
  };

  // BƯỚC 3: TẠO CÁC HÀM XỬ LÝ CHO MODAL
  const handleOpenCreateModal = () => {
    setEditingCake(null); // Đặt editingCake là null để modal biết đây là chế độ "Tạo mới"
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cake: Cake) => {
    setEditingCake(cake); // Truyền dữ liệu của bánh cần sửa vào state
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    handleCloseModal(); // Đóng modal
    fetchCakes(); // Tải lại dữ liệu trong bảng
  };

  const columns: GridColDef<Cake>[] = [
    { field: "idBANH", headerName: "ID", width: 90 },
    { field: "tenBANH", headerName: "Tên Bánh", flex: 1 },
    {
      field: "giaBANH",
      headerName: "Giá Bán",
      type: "number",
      width: 150,
      renderCell: (params) => {
        if (params.value == null) return "";
        return (
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(params.value)}
          </span>
        );
      },
    },
    {
      field: "LoaiBanh",
      headerName: "Loại Bánh",
      width: 180,
      renderCell: (params) => (
        <span>{params.row.LoaiBanh?.tenLOAIBANH || "Chưa phân loại"}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Cake>) => (
        <>
          {/* BƯỚC 4: GẮN HÀM XỬ LÝ VÀO NÚT SỬA */}
          <IconButton onClick={() => handleOpenEditModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.idBANH)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản Lý Sản Phẩm
      </Typography>
      {/* BƯỚC 5: GẮN HÀM XỬ LÝ VÀO NÚT THÊM MỚI */}
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleOpenCreateModal}
      >
        Thêm Sản Phẩm Mới
      </Button>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={cakes}
          columns={columns}
          getRowId={(row) => row.idBANH}
          loading={loading}
        />
      </Box>

      {/* BƯỚC 6: RENDER MODAL VÀ TRUYỀN CÁC PROPS CẦN THIẾT */}
      <ProductFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        cakeToEdit={editingCake}
      />
    </Box>
  );
}
