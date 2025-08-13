// src/pages/admin/ProductionHistoryPage.tsx
import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { productionApi, ProductionBatch } from "../../api/productionApi";
import ProductionFormModal from "../../components/admin/ProductionFormModal";

export default function ProductionHistoryPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(false);
  // THÊM STATE ĐỂ QUẢN LÝ MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await productionApi.getAll();
      setBatches(response.data);
    } catch (error) {
      toast.error("Không thể tải lịch sử sản xuất.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // THÊM CÁC HÀM HANDLER CHO MODAL
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    handleCloseModal();
    fetchData(); // Tải lại dữ liệu sau khi tạo lô thành công
  };

  const columns: GridColDef<ProductionBatch>[] = [
    { field: "idLSX", headerName: "Mã Lô", width: 90 },
    {
      field: "cakeName", // Tên field ảo
      headerName: "Tên Bánh",
      width: 250,
      // SỬ DỤNG RENDERCELL ĐỂ HIỂN THỊ DỮ LIỆU LỒNG NHAU
      renderCell: (params) => {
        // Kiểm tra cả 'Banh' và 'banh' cho chắc chắn
        const cake = params.row.Banh || (params.row as any).banh;
        return <span>{cake?.tenBANH || "Không rõ"}</span>;
      },
    },
    {
      field: "soLuongSanXuat",
      headerName: "SL Sản Xuất",
      type: "number",
      width: 130,
    },
    {
      field: "soLuongTon",
      headerName: "SL Tồn Kho",
      type: "number",
      width: 130,
    },
    {
      field: "ngaySanXuat",
      headerName: "Ngày Sản Xuất",
      width: 180,
      // --- SỬA LẠI Ở ĐÂY: Dùng renderCell ---
      renderCell: (params) => {
        if (!params.value) return "";
        try {
          // Thử format ngày tháng
          return new Date(params.value).toLocaleDateString("vi-VN");
        } catch (e) {
          // Nếu có lỗi, hiển thị giá trị gốc để debug
          return String(params.value);
        }
      },
    },
    {
      field: "hanSuDung",
      headerName: "Hạn Sử Dụng",
      width: 180,
      // --- SỬA LẠI Ở ĐÂY: Dùng renderCell ---
      renderCell: (params) => {
        if (!params.value) return "";
        try {
          // Thử format ngày tháng
          return new Date(params.value).toLocaleDateString("vi-VN");
        } catch (e) {
          // Nếu có lỗi, hiển thị giá trị gốc để debug
          return String(params.value);
        }
      },
    },
    {
      field: "employeeName", // Tên field ảo
      headerName: "Người Thực Hiện",
      flex: 1,
      renderCell: (params) => {
        const employee = params.row.NhanVien || (params.row as any).nhanVien;
        return <span>{employee?.hotenNV || "Không rõ"}</span>;
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lịch Sử Sản Xuất
      </Typography>
      {/* THÊM NÚT ĐỂ MỞ MODAL */}
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpenModal}>
        Tạo Lô Sản Xuất Mới
      </Button>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={batches}
          columns={columns}
          getRowId={(row) => row.idLSX}
          loading={loading}
        />
      </Box>
      {/* RENDER MODAL VÀ TRUYỀN PROPS VÀO */}
      <ProductionFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
