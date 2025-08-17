// src/api/userApi.ts
import axiosClient from './axiosClient';
import { ApiResponse, User } from '../types';

// === Dành cho Người dùng (User-facing) ===
interface UpdateProfileData {
  hotenKH?: string; sdtKH?: string; diachiKH?: string; hotenNV?: string;
}

// === Dành cho Quản trị viên (Admin-facing) ===
export interface UserFormData {
  id?: number;
  hoten?: string;
  email?: string;
  matkhau?: string;
  role?: string;
  type?: 'customer' | 'employee';
}

export const userApi = {
  // --- Hàm cho trang Profile ---
  updateProfile: (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    return axiosClient.put('/users/me', data).then(res => res.data);
  },

  // --- HÀM CHO TRANG QUẢN LÝ TÀI KHOẢN ---
  getAllUsers: async (): Promise<User[]> => {
    const [customerRes, employeeRes] = await Promise.all([
      axiosClient.get('/users/customers'),
      axiosClient.get('/users/employees')
    ]);

    // Sửa lỗi "No rows": Chỉ truy cập .data một lần
    const customers = customerRes.data.data.map((user: any) => ({
      ...user, id: user.idKH, hoten: user.hotenKH, email: user.emailKH, role: 'Khách Hàng', type: 'customer'
    }));
    const employees = employeeRes.data.data.map((user: any) => ({
      ...user, id: user.idNV, hoten: user.hotenNV, email: user.emailNV, role: user.chucvuNV, type: 'employee'
    }));
    
    return [...customers, ...employees];
  },

  // --- HÀM TẠO MỚI ĐÚNG ---
  createUser: (userData: UserFormData): Promise<User> => {
    let backendData;
    let endpoint;

    if (userData.role === 'KhachHang') {
      endpoint = '/auth/register';
      backendData = {
        hotenKH: userData.hoten,
        emailKH: userData.email,
        matkhauKH: userData.matkhau,
      };
    } else {
      endpoint = '/users/employees';
      backendData = {
        hotenNV: userData.hoten,
        emailNV: userData.email,
        matkhauNV: userData.matkhau,
        chucvuNV: userData.role,
      };
    }
    
    return axiosClient.post(endpoint, backendData);
  },

  // --- HÀM CẬP NHẬT ---
  updateUser: (id: number, type: 'customer' | 'employee', userData: UserFormData): Promise<User> => {
    const backendData = type === 'customer'
      ? { hotenKH: userData.hoten }
      : { hotenNV: userData.hoten, chucvuNV: userData.role };
    const endpoint = type === 'customer' ? `/users/customers/${id}` : `/users/employees/${id}`;
    return axiosClient.put(endpoint, backendData);
  },

  // --- HÀM XÓA ---
  deleteUser: (id: number, type: 'customer' | 'employee'): Promise<void> => {
    const endpoint = type === 'customer' ? `/users/customers/${id}` : `/users/employees/${id}`;
    return axiosClient.delete(endpoint);
  },
};