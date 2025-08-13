// src/pages/admin/UserManagementPage.tsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { userApi, User, UserFormData } from "../../api/userApi";

// MUI Components
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContentText,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// MUI Icons
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal Thêm/Sửa
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserFormData | null>(null);

  // State cho Modal Xác nhận Xóa
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allUsers = await userApi.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      toast.error("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Xử lý Modal ---
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setCurrentUser({ hoten: "", email: "", role: "KhachHang", matkhau: "" });
    setOpenModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setIsEditMode(true);
    setCurrentUser({
      id: user.id,
      hoten: user.hoten,
      email: user.email,
      role: user.role,
      type: user.type,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentUser(null);
  };

  // --- Xử lý Xóa ---
  const handleOpenDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setUserToDelete(null);
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await userApi.deleteUser(userToDelete.id, userToDelete.type);
      toast.success("Xóa tài khoản thành công!");
      fetchData(); // Tải lại danh sách
    } catch (error) {
      toast.error("Xóa tài khoản thất bại.");
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  // --- Xử lý Submit Form ---
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    try {
      if (isEditMode) {
        if (!currentUser.id || !currentUser.type)
          throw new Error("Missing user ID or type for update");
        // Gửi dữ liệu đi, tầng API sẽ tự "dịch" tên trường
        await userApi.updateUser(currentUser.id, currentUser.type, currentUser);
        toast.success("Cập nhật tài khoản thành công!");
      } else {
        // Gửi dữ liệu đi, tầng API sẽ tự "dịch" tên trường
        await userApi.createUser(currentUser);
        toast.success("Tạo tài khoản thành công!");
      }
      fetchData(); // Tải lại dữ liệu mới nhất
      handleCloseModal();
    } catch (error: any) {
      // <-- SỬA LẠI THAM SỐ CỦA CATCH
      // === NÂNG CẤP Ở ĐÂY ===
      // 1. Cố gắng đọc thông điệp lỗi cụ thể từ response của backend
      const errorMessage =
        error.response?.data?.message || "Thao tác thất bại. Vui lòng thử lại.";

      // 2. Hiển thị thông điệp lỗi đó cho người dùng
      toast.error(errorMessage);
    }
  };

  // --- Cấu hình cột cho DataGrid ---
  const columns: GridColDef<User>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "hoten", headerName: "Họ Tên", width: 250, flex: 1 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "role",
      headerName: "Vai Trò",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value !== "Khách Hàng" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenEditModal(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleOpenDeleteConfirm(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quản Lý Tài Khoản
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Thêm Tài Khoản Mới
        </Button>
      </Box>

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => `${row.type}-${row.id}`}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>

      {/* Modal Thêm/Sửa */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {isEditMode ? "Chỉnh Sửa Tài Khoản" : "Tạo Mới Tài Khoản"}
        </DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Họ Tên"
              type="text"
              fullWidth
              required
              value={currentUser?.hoten || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, hoten: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
              disabled={isEditMode}
              value={currentUser?.email || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Tên Tài Khoản"
              type="text"
              fullWidth
              required
              disabled={isEditMode}
              value={currentUser?.taikhoan || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, taikhoan: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Mật Khẩu"
              type="password"
              fullWidth
              required={!isEditMode} // Mật khẩu chỉ bắt buộc khi tạo mới
              helperText={isEditMode ? "Để trống nếu không muốn thay đổi" : ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, matkhau: e.target.value })
              }
            />
            <FormControl
              fullWidth
              margin="dense"
              required
              disabled={isEditMode}
            >
              <InputLabel>Vai Trò</InputLabel>
              <Select
                value={currentUser?.role || "KhachHang"}
                label="Vai Trò"
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value })
                }
              >
                <MenuItem value="KhachHang">Khách Hàng</MenuItem>
                <MenuItem value="Admin">Quản Lý</MenuItem>
                <MenuItem value="NhanVien">Nhân Viên Bán Hàng</MenuItem>
                {/* Thêm các role khác */}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Hủy</Button>
            <Button type="submit" variant="contained">
              {isEditMode ? "Lưu" : "Tạo Mới"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Xác nhận Xóa */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài khoản{" "}
            <strong>{userToDelete?.email}</strong>? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xác Nhận Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
