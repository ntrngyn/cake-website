// src/api/categoryApi.ts
import axiosClient from './axiosClient';
import { ApiResponse } from '../types';

// Định nghĩa kiểu dữ liệu cho một Loại Bánh
export interface Category {
  idLB: number;
  tenLOAIBANH: string;
}

// Định nghĩa kiểu cho payload khi tạo/cập nhật
interface CategoryPayload {
    tenLOAIBANH: string;
}

// (Thêm interface này nếu chưa có)
interface DeleteResponse {
    message: string;
}

export const categoryApi = {
  // Hàm lấy tất cả các loại bánh
  getAll: (): Promise<ApiResponse<Category[]>> => {
    const url = '/categories';
    return axiosClient.get(url).then(res => res.data);
  },

  // Hàm tạo một loại bánh mới
  create: (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    const url = '/categories';
    return axiosClient.post(url, payload).then(res => res.data);
  },
  
  // (Thêm các hàm update, delete nếu bạn cần quản lý loại bánh ở một trang riêng)
  // --- THÊM CÁC HÀM MỚI ---
  update: (id: number, payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    const url = `/categories/${id}`;
    return axiosClient.put(url, payload).then(res => res.data);
  },

  remove: (id: number): Promise<DeleteResponse> => {
    const url = `/categories/${id}`;
    return axiosClient.delete(url).then(res => res.data);
  }
};