// src/api/inventoryApi.ts
import axiosClient from './axiosClient';
import { ApiResponse } from '../types';
import { Ingredient } from './ingredientApi';
import { User } from '../redux/authSlice';

// Kiểu dữ liệu cho một chi tiết phiếu nhập
interface StockInDetail {
    idCTPN: number;
    soLuongNhap: number;
    donGiaNhap: number;
    hanSuDung: string;
    thanhTien: number;
    NguyenLieu: Ingredient;
}

// Kiểu dữ liệu cho một phiếu nhập đầy đủ
export interface StockIn {
    idPN: number;
    ngayNhap: string;
    tongTien: number;
    ghiChu: string;
    NhanVien: User;
    details: StockInDetail[];
}

// THÊM CÁC INTERFACE MỚI CHO PAYLOAD
interface StockInDetailPayload {
  idNL: number;
  soLuongNhap: number;
  donGiaNhap: number;
  hanSuDung: string; // YYYY-MM-DD
}

export interface StockInPayload {
  ghiChu?: string;
  details: StockInDetailPayload[];
}

export const inventoryApi = {
    getAll: (): Promise<ApiResponse<StockIn[]>> => {
        const url = '/inventory/stock-in';
        return axiosClient.get(url).then(res => res.data);
    },
    getById: (id: number): Promise<ApiResponse<StockIn>> => {
        const url = `/inventory/stock-in/${id}`;
        return axiosClient.get(url).then(res => res.data);
    },

    // THÊM HÀM CREATE
    create: (payload: StockInPayload): Promise<ApiResponse<StockIn>> => {
        const url = '/inventory/stock-in';
        return axiosClient.post(url, payload).then(res => res.data);
    }
};