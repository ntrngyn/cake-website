// src/api/statusApi.ts
import axiosClient from './axiosClient';
import { ApiResponse } from '../types';

export interface OrderStatus {
  idTTDH: number;
  tenTrangThaiDH: string;
}

export const statusApi = {
  getAll: (): Promise<ApiResponse<OrderStatus[]>> => {
    const url = '/statuses';
    return axiosClient.get(url).then(res => res.data);
  },
};