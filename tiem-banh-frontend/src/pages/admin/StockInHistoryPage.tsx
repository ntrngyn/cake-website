// src/pages/admin/StockInHistoryPage.tsx
import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { inventoryApi, StockIn } from "../../api/inventoryApi";
import StockInFormModal from "../../components/admin/StockInFormModal"; // <-- IMPORT MODAL

export default function StockInHistoryPage() {
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [loading, setLoading] = useState(false);

  // THÊM STATE CHO MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
    fetchData();
  }, []);

  // THÊM CÁC HÀM HANDLER
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    handleCloseModal();
    fetchData(); // Tải lại dữ liệu sau khi tạo phiếu thành công
  };

  const columns: GridColDef<StockIn>[] = [
    { field: "idPN", headerName: "Mã Phiếu", width: 100 },
    {
      field: "ngayNhap",
      headerName: "Ngày Nhập",
      width: 180,
      // SỬ DỤNG RENDERCELL
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
      // SỬ DỤNG RENDERCELL
      renderCell: (params) => {
        return <span>{params.row.NhanVien?.hotenNV || "Không rõ"}</span>;
      },
    },
    {
      field: "tongTien",
      headerName: "Tổng Tiền",
      type: "number",
      width: 150,
      // SỬ DỤNG RENDERCELL
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
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lịch Sử Nhập Kho
      </Typography>
      {/* THÊM NÚT ĐỂ MỞ MODAL */}
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpenModal}>
        Tạo Phiếu Nhập Mới
      </Button>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={stockIns}
          columns={columns}
          getRowId={(row) => row.idPN}
          loading={loading}
        />
      </Box>
      {/* RENDER MODAL VÀ TRUYỀN PROPS VÀO */}
      <StockInFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
