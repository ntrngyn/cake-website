// src/pages/admin/OrderManagementPage.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { orderApi, Order } from "../../api/orderApi";
import { statusApi, OrderStatus } from "../../api/statusApi"; // <-- IMPORT STATUS API

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi cả hai API cùng lúc để tăng tốc
      const [orderRes, statusRes] = await Promise.all([
        orderApi.getAll(),
        statusApi.getAll(),
      ]);
      setOrders(orderRes.data);
      setStatuses(statusRes.data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu trang quản lý đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect giờ chỉ gọi một hàm duy nhất
  useEffect(() => {
    fetchData();
  }, []);

  // Phiên bản MỚI
  // Sửa 'SelectChangeEvent<number>' thành 'SelectChangeEvent<string>'
  // Hoặc đơn giản hơn là để TypeScript tự suy luận từ component
  const handleStatusChange = async (
    event: SelectChangeEvent<unknown>,
    orderId: number
  ) => {
    const newStatusId = event.target.value as number; // Ép kiểu giá trị thành number

    // Kiểm tra xem ID có hợp lệ không
    if (!newStatusId) return;

    try {
      await orderApi.updateStatus(orderId, newStatusId);
      toast.success(`Cập nhật trạng thái cho đơn hàng #${orderId} thành công!`);
      // Cập nhật state cục bộ để giao diện phản hồi ngay lập tức
      const updatedOrders = orders.map((order) =>
        order.idDH === orderId
          ? {
              ...order,
              idTTDH: newStatusId,
              // Cập nhật cả tên trạng thái để UI hiển thị đúng
              TrangThaiDonHang: {
                tenTrangThaiDH:
                  statuses.find((s) => s.idTTDH === newStatusId)
                    ?.tenTrangThaiDH || "",
              },
            }
          : order
      );
      setOrders(updatedOrders);

      // --- THAY ĐỔI Ở ĐÂY ---
      // Thay vì cập nhật state cục bộ, hãy gọi lại hàm fetchData
      // để lấy dữ liệu mới nhất từ server.
      // fetchData();
    } catch (error: any) {
      // Sửa lại catch
      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Cập nhật trạng thái thất bại.";
      toast.error(errorMessage);
    }
  };

  // --- THAY THẾ TOÀN BỘ MẢNG NÀY ---
  const columns: GridColDef<Order>[] = [
    {
      field: "idDH",
      headerName: "Mã ĐH",
      width: 80,
    },
    {
      field: "customerName", // Tên field ảo
      headerName: "Tên Khách Hàng",
      width: 220,
      flex: 1, // Cho phép cột này co giãn
      // SỬ DỤNG RENDERCELL ĐỂ ĐẢM BẢO HIỂN THỊ
      renderCell: (params) => {
        return <span>{params.row.KhachHang?.hotenKH || "Không có"}</span>;
      },
    },
    {
      field: "ngaylapDH",
      headerName: "Ngày Đặt",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "";
        // Định dạng lại ngày tháng
        return <span>{new Date(params.value).toLocaleString("vi-VN")}</span>;
      },
    },
    {
      field: "tonggiatriDH",
      headerName: "Tổng Tiền",
      type: "number",
      width: 150,
      renderCell: (params) => {
        if (params.value == null) return "";
        // Định dạng tiền tệ
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
      field: "idTTDH",
      headerName: "Trạng Thái",
      width: 200,
      renderCell: (params) => {
        if (!params.row) return null;

        // --- LOGIC VÔ HIỆU HÓA ĐƯỢC THÊM VÀO ĐÂY ---
        // Lấy ID của trạng thái hiện tại từ dữ liệu dòng
        const currentStatusId = params.row.idTTDH;

        // Xác định xem trạng thái có phải là trạng thái cuối cùng không
        // Giả sử 4 là 'Hoàn thành' và 5 là 'Đã hủy'
        const isFinalState = currentStatusId === 4 || currentStatusId === 5;
        //------------------------------------------------

        return (
          <Select
            value={params.value}
            onChange={(e) => handleStatusChange(e, params.row.idDH)}
            // Thêm prop 'disabled'
            disabled={isFinalState}
            size="small"
            sx={{ width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            {statuses.map((status) => (
              <MenuItem key={status.idTTDH} value={status.idTTDH}>
                {status.tenTrangThaiDH}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  return (
    // BƯỚC 1: SỬ DỤNG <Paper> LÀM COMPONENT BAO BỌC NGOÀI CÙNG
    <Paper sx={{ p: 3, width: "100%" }}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" component="h1" gutterBottom>
        Quản Lý Đơn Hàng
      </Typography>

      {/* Bảng dữ liệu được đặt trong một Box có chiều cao cố định */}
      <Box sx={{ height: 650, width: "100%", mt: 2 }}>
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row.idDH}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>
    </Paper>
  );
}
