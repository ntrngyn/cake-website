// src/pages/public/OrderHistoryPage.tsx
import { useState, useEffect } from "react";
import { orderApi, Order } from "../../api/orderApi";
import { toast } from "react-toastify";

// MUI Components
import { Box, Typography, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Hàm helper để tạo màu cho Chip trạng thái
const getStatusChipColor = (statusId: number) => {
  switch (statusId) {
    case 1:
      return "warning"; // Chờ xác nhận
    case 2:
      return "info"; // Đang xử lý
    case 3:
      return "primary"; // Đang giao
    case 4:
      return "success"; // Hoàn thành
    case 5:
      return "error"; // Đã hủy
    default:
      return "default";
  }
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderApi.getMyOrders();
        setOrders(response.data);
      } catch (error) {
        toast.error("Không thể tải lịch sử đơn hàng.");
        console.error("Failed to fetch order history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Định nghĩa các cột cho DataGrid
  const columns: GridColDef<Order>[] = [
    {
      field: "idDH",
      headerName: "Mã Đơn Hàng",
      width: 130,
      renderCell: (params) => <strong>#{params.value}</strong>,
    },
    {
      field: "ngaylapDH",
      headerName: "Ngày Đặt",
      width: 200,
      renderCell: (params) => new Date(params.value).toLocaleString("vi-VN"),
    },
    {
      field: "tonggiatriDH",
      headerName: "Tổng Tiền",
      type: "number",
      width: 180,
      renderCell: (params) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(params.value),
    },
    {
      field: "TrangThaiDonHang",
      headerName: "Trạng Thái",
      flex: 1, // Chiếm hết không gian còn lại
      renderCell: (params) => (
        <Chip
          label={params.row.TrangThaiDonHang?.tenTrangThaiDH || "Đang cập nhật"}
          color={getStatusChipColor(params.row.idTTDH)}
          size="small"
        />
      ),
    },
  ];

  if (orders.length === 0 && !loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Lịch Sử Đơn Hàng
        </Typography>
        <Typography>Bạn chưa có đơn hàng nào.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 600, width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Lịch Sử Đơn Hàng
      </Typography>
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={(row) => row.idDH}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        autoHeight
      />
    </Box>
  );
}
