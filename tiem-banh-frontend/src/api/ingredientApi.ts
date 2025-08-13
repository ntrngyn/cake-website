// src/api/ingredientApi.ts
import axiosClient from './axiosClient';
import { ApiResponse, DeleteResponse } from '../types';

// Định nghĩa kiểu dữ liệu cho một Nguyên Liệu
export interface Ingredient {
  idNL: number;
  tenNL: string;
  donviNL: string;
  soluongtonNL: number;
  soluongtontoithieuNL: number;
}

// Kiểu dữ liệu cho payload khi tạo/cập nhật
export interface IngredientPayload {
  tenNL: string;
  donviNL: string;
  soluongtontoithieuNL?: number;
}

export const ingredientApi = {
  getAll: (): Promise<ApiResponse<Ingredient[]>> => {
    const url = '/ingredients';
    return axiosClient.get(url).then(res => res.data);
  },
  create: (payload: IngredientPayload): Promise<ApiResponse<Ingredient>> => {
    const url = '/ingredients';
    return axiosClient.post(url, payload).then(res => res.data);
  },
  update: (id: number, payload: IngredientPayload): Promise<ApiResponse<Ingredient>> => {
    const url = `/ingredients/${id}`;
    return axiosClient.put(url, payload).then(res => res.data);
  },
  remove: (id: number): Promise<DeleteResponse> => {
    const url = `/ingredients/${id}`;
    return axiosClient.delete(url).then(res => res.data);
  },
};