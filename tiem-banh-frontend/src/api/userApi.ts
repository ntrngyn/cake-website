// src/api/userApi.ts
import axiosClient from './axiosClient';
import { ApiResponse, User } from '../types';

// Định nghĩa kiểu dữ liệu cho form cập nhật
// Chúng ta chỉ cho phép cập nhật một vài trường
interface UpdateProfileData {
  hotenKH?: string;
  sdtKH?: string;
  diachiKH?: string;
}

export const userApi = {
  // Hàm cập nhật thông tin cá nhân
  updateProfile: (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const url = '/users/me';
    return axiosClient.put(url, data).then(res => res.data);
  },
};