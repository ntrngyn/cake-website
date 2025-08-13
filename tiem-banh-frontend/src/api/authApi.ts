// src/api/authApi.ts
import axiosClient from './axiosClient';

// Định nghĩa các kiểu dữ liệu cho request và response
// (Chúng ta sẽ định nghĩa User trong authSlice để dùng chung)
import { User } from '../redux/authSlice'; 

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

interface LoginResponse {
  user: User;
  token: string;
}

// Cấu trúc response chung từ API backend của bạn
interface ApiResponse<T> {
    message: string;
    data: T;
}

// Object chứa các hàm gọi API
export const authApi = {
  login: (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    const url = '/auth/login';
    return axiosClient.post(url, credentials).then(res => res.data);
  },

  register: (data: RegisterData): Promise<ApiResponse<User>> => {
    const url = '/auth/register';
    return axiosClient.post(url, data).then(res => res.data);
  },

  getMe: (): Promise<ApiResponse<User>> => {
    const url = '/users/me';
    return axiosClient.get(url).then(res => res.data);
  },
};