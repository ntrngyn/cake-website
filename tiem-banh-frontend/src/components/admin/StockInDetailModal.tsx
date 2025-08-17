// src/components/admin/StockInDetailModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { StockIn } from "../../api/inventoryApi"; // Import kiểu dữ liệu

interface Props {
  open: boolean;
  onClose: () => void;
  stockIn: StockIn | null; // Dữ liệu phiếu nhập cần hiển thị
}

export default function StockInDetailModal({ open, onClose, stockIn }: Props) {
  if (!stockIn) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi Tiết Phiếu Nhập #{stockIn.idPN}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography>
            <strong>Ngày nhập:</strong>{" "}
            {new Date(stockIn.ngayNhap).toLocaleString("vi-VN")}
          </Typography>
          <Typography>
            <strong>Nhân viên:</strong>{" "}
            {stockIn.NhanVien?.hotenNV || "Không rõ"}
          </Typography>
          <Typography>
            <strong>Ghi chú:</strong> {stockIn.ghiChu || "Không có"}
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên Nguyên Liệu</TableCell>
                <TableCell align="right">Số Lượng</TableCell>
                <TableCell align="right">Đơn Giá</TableCell>
                <TableCell align="right">Hạn Sử Dụng</TableCell>
                <TableCell align="right">Thành Tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockIn.details?.map((item) => (
                <TableRow key={item.idCTPN}>
                  <TableCell>{item.NguyenLieu?.tenNL}</TableCell>
                  <TableCell align="right">{item.soLuongNhap}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("vi-VN").format(item.donGiaNhap)} đ
                  </TableCell>
                  <TableCell align="right">
                    {new Date(item.hanSuDung).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("vi-VN").format(item.thanhTien)} đ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography variant="h6">
            Tổng Tiền:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(stockIn.tongTien)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
