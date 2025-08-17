// src/pages/admin/StockInHistoryPage.tsx
import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"; // Thêm GridRenderCellParams
import { toast } from "react-toastify";
import { inventoryApi, StockIn } from "../../api/inventoryApi";
import StockInFormModal from "../../components/admin/StockInFormModal";
import StockInDetailModal from "../../components/admin/StockInDetailModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

export default function StockInHistoryPage() {
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // === BƯỚC 1: BỔ SUNG CÁC KHAI BÁO STATE CÒN THIẾU ===
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStockIn, setSelectedStockIn] = useState<StockIn | null>(null);
  // =======================================================

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await inventoryApi.getAll();
      setStockIns(response.data);
    } catch (error) {
      toast.error("Không thể tải lịch sử nhập kho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleSuccessCreate = () => {
    handleCloseCreateModal();
    fetchData();
  };

  const handleOpenDetailModal = async (id: number) => {
    try {
      const response = await inventoryApi.getById(id);
      setSelectedStockIn(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết phiếu nhập.");
    }
  };
  const handleCloseDetailModal = () => setIsDetailModalOpen(false);

  const columns: GridColDef<StockIn>[] = [
    { field: "idPN", headerName: "Mã Phiếu", width: 100 },
    {
      field: "ngayNhap",
      headerName: "Ngày Nhập",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "";
        return (
          <span>{new Date(params.value).toLocaleDateString("vi-VN")}</span>
        );
      },
    },
    {
      field: "NhanVien",
      headerName: "Nhân Viên Nhập",
      width: 200,
      renderCell: (params) => {
        return <span>{params.row.NhanVien?.hotenNV || "Không rõ"}</span>;
      },
    },
    {
      field: "tongTien",
      headerName: "Tổng Tiền",
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
    { field: "ghiChu", headerName: "Ghi Chú", flex: 1 },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams<StockIn>) => (
        <IconButton onClick={() => handleOpenDetailModal(params.row.idPN)}>
          <VisibilityIcon />
        </IconButton>
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
          Lịch Sử Nhập Kho
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Tạo Phiếu Nhập Mới
        </Button>
      </Box>

      {/* Bảng dữ liệu được đặt trong một Box có chiều cao cố định */}
      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={stockIns}
          columns={columns}
          getRowId={(row) => row.idPN}
          loading={loading}
        />
      </Box>

      {/* Modal Tạo Mới */}
      <StockInFormModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccessCreate}
      />

      {/* Modal Xem Chi Tiết */}
      <StockInDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        stockIn={selectedStockIn}
      />
    </Paper>
  );
}
