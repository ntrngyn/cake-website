// src/api/cakeApi.ts
import axiosClient from './axiosClient';
import { ApiResponse, DeleteResponse } from '../types'; // Import cấu trúc response chung

// Định nghĩa kiểu cho một dòng trong công thức
interface RecipeItem {
    idNL: number;
    soluong: number;
    donvi: string;
}

// Định nghĩa kiểu cho payload khi tạo/cập nhật bánh
export interface CakePayload {
  tenBANH: string;
  motaBANH?: string;
  giaBANH: number;
  hinhanhBANH?: string;
  idLB: number;
  congthuc: RecipeItem[];
}

// Định nghĩa kiểu dữ liệu cho một sản phẩm Banh
export interface Cake {
  idBANH: number;
  tenBANH: string;
  motaBANH: string;
  giaBANH: number;
  hinhanhBANH: string;
  idLB: number;
  LoaiBanh?: { // Dữ liệu này được include từ backend
    tenLOAIBANH: string;
  }
}

// Định nghĩa kiểu cho response từ API get all cakes (có phân trang)
interface CakesApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  cakes: Cake[];
}

// Định nghĩa kiểu cho các tham số query
interface GetAllCakesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}

export const cakeApi = {
  // Hàm lấy tất cả bánh với các tùy chọn filter, search, pagination
  getAll: (params: GetAllCakesParams): Promise<ApiResponse<CakesApiResponse>> => {
    const url = '/cakes';
    // Axios sẽ tự động chuyển object params thành query string: ?page=1&limit=10...
    return axiosClient.get(url, { params }).then(res => res.data);
  },

  // Hàm lấy chi tiết một bánh
  getById: (id: number): Promise<ApiResponse<Cake>> => {
    const url = `/cakes/${id}`;
    return axiosClient.get(url).then(res => res.data);
  },

  // --- THÊM CÁC HÀM MỚI DƯỚI ĐÂY ---
  create: (payload: CakePayload): Promise<ApiResponse<Cake>> => {
    const url = '/cakes';
    return axiosClient.post(url, payload).then(res => res.data);
  },

  update: (id: number, payload: Partial<CakePayload>): Promise<ApiResponse<Cake>> => {
    const url = `/cakes/${id}`;
    return axiosClient.put(url, payload).then(res => res.data);
  },

  remove: (id: number): Promise<DeleteResponse> => {
    const url = `/cakes/${id}`;
    return axiosClient.delete(url).then(res => res.data);
  },

  getFeatured: (): Promise<ApiResponse<Cake[]>> => { // Response data là một mảng Cake
      const url = '/cakes/featured';
      return axiosClient.get(url).then(res => res.data);
  },
};