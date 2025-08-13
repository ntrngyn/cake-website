// src/api/productionApi.ts
import axiosClient from './axiosClient';
import { ApiResponse } from '../types';
import { Cake } from './cakeApi';
import { User } from '../redux/authSlice';

export interface ProductionBatch {
    idLSX: number;
    soLuongSanXuat: number;
    soLuongTon: number;
    ngaySanXuat: string;
    hanSuDung: string;
    Banh: Cake;
    NhanVien: User;
}

// THÊM INTERFACE MỚI CHO PAYLOAD
export interface ProductionPayload {
    idBANH: number;
    soLuongSanXuat: number;
    hanSuDung: string; // Gửi lên dưới dạng chuỗi YYYY-MM-DD
}

export const productionApi = {
    getAll: (): Promise<ApiResponse<ProductionBatch[]>> => {
        const url = '/production/batches';
        return axiosClient.get(url).then(res => res.data);
    },
    
    // THÊM HÀM CREATE
    create: (payload: ProductionPayload): Promise<ApiResponse<ProductionBatch>> => {
        const url = '/production/batches';
        return axiosClient.post(url, payload).then(res => res.data);
    }
};