// src/redux/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { AxiosError } from 'axios'; // <-- BƯỚC 1: Import AxiosError

// --- Định nghĩa các kiểu dữ liệu ---

// Kiểu dữ liệu cho một User object
export interface User {
  id: number;
  role: string;

  // Thuộc tính của Nhân viên
  hotenNV?: string;
  emailNV?: string;
  sdtNV?: string; // Bổ sung
  diachiNV?: string; // Bổ sung

  // Thuộc tính của Khách hàng
  hotenKH?: string;
  emailKH?: string;
  taikhoanKH?: string;
  sdtKH?: string; // Bổ sung
  diachiKH?: string; // Bổ sung
}

// Kiểu dữ liệu cho state của slice này
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Kiểu dữ liệu cho tham số đầu vào của các thunk
interface LoginCredentials {
  taikhoan: string;
  matkhau: string;
}

interface RegisterData {
  hotenKH: string;
  emailKH: string;
  taikhoanKH: string;
  matkhauKH: string;
}

// Kiểu dữ liệu cho response thành công của API login
interface LoginSuccessPayload {
  user: User;
  token: string;
}

// BƯỚC 2: Định nghĩa kiểu cho response lỗi từ API
interface ApiErrorResponse {
    message: string;
    // Có thể có các trường khác như 'statusCode', 'error' tùy theo backend của bạn
}


// --- Tạo các Async Thunks ---
export const loginUser = createAsyncThunk<LoginSuccessPayload, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data; 
    } catch (err) {
      // BƯỚC 3: Ép kiểu lỗi thành AxiosError
      const error = err as AxiosError<ApiErrorResponse>; 
      return rejectWithValue(error.response?.data.message || 'Đăng nhập thất bại');
    }
  }
);

export const registerUser = createAsyncThunk<User, RegisterData, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (err) {
       // BƯỚC 3: Ép kiểu lỗi thành AxiosError
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(error.response?.data.message || 'Đăng ký thất bại');
    }
  }
);

// --- THÊM LẠI THUNK NÀY ---
export const fetchUserFromToken = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe();
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(error.response?.data.message || 'Phiên đăng nhập không hợp lệ');
    }
  }
);

// --- State ban đầu ---
const token = localStorage.getItem('token');
const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  loading: 'idle',
  error: null,
};

// --- Tạo Slice ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      // Thêm 2 dòng reset này
      state.loading = 'idle'; 
      state.error = null;
    },
  // --- THÊM LẠI REDUCER NÀY ---
    updateUser: (state, action: PayloadAction<User>) => {
        // Chuẩn hóa dữ liệu trước khi cập nhật
        const receivedUser = action.payload as any;
        const normalizedUser: User = {
            id: receivedUser.idKH || receivedUser.idNV,
            role: receivedUser.role,
            ...receivedUser
        };
        state.user = normalizedUser;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        // Bỏ loading ở đây để App.tsx không thấy pending nữa
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // --- THÊM LẠI CÁC CASE NÀY ---
      .addCase(fetchUserFromToken.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        // Làm tương tự cho fetchUserFromToken
        const receivedUser = action.payload as any;
        const normalizedUser: User = {
            id: receivedUser.idKH || receivedUser.idNV,
            role: receivedUser.role,
            ...receivedUser
        };
        state.loading = 'succeeded';
        state.isAuthenticated = true;
        state.user = normalizedUser;
      })
      .addCase(fetchUserFromToken.rejected, (state) => {
        state.loading = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, updateUser } = authSlice.actions; // Export action mới
export default authSlice.reducer;