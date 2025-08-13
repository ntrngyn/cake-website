// src/api/orderApi.ts
import axiosClient from './axiosClient';
import { ApiResponse, User, Cake } from '../types';

// --- Định nghĩa các kiểu dữ liệu ---

// Kiểu dữ liệu cho một item trong request body khi tạo đơn hàng
interface OrderItemPayload {
  idBANH: number;
  soluong: number;
}

// Kiểu dữ liệu cho toàn bộ request body khi tạo đơn hàng
interface CreateOrderPayload {
  items: OrderItemPayload[];
}

// Kiểu dữ liệu cho object TrangThaiDonHang lồng trong Order
interface OrderStatus {
    tenTrangThaiDH: string;
}

// Kiểu dữ liệu cho một Chi Tiết Đơn Hàng (sản phẩm trong đơn hàng)
interface OrderDetail extends Cake {
    ChiTietDonHang: {
        soluong: number;
        giaBANHLUCBAN: number;
        thanhtien: number;
    }
}

// Kiểu dữ liệu đầy đủ cho một object Đơn Hàng trả về từ API
export interface Order {
  idDH: number;
  ngaylapDH: string;
  tonggiatriDH: number;
  idNV?: number;
  NhanVien?: User;
  idKH: number;
  KhachHang?: User;

  idTTDH: number;
  TrangThaiDonHang?: OrderStatus;
  Banhs?: OrderDetail[];
}


// --- Object chứa các hàm API ---

export const orderApi = {
  /**
   * Tạo một đơn hàng mới.
   * @param payload - Chứa mảng các sản phẩm cần đặt.
   */
  create: (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    const url = '/orders';
    return axiosClient.post(url, payload).then(res => res.data);
  },

  /**
   * Lấy lịch sử đơn hàng của khách hàng đang đăng nhập.
   */
  getMyOrders: (): Promise<ApiResponse<Order[]>> => {
    const url = '/orders/my-orders';
    return axiosClient.get(url).then(res => res.data);
  },
  
  /**
   * Lấy tất cả các đơn hàng (dành cho Admin).
   */
  getAll: (): Promise<ApiResponse<Order[]>> => {
    const url = '/orders';
    return axiosClient.get(url).then(res => res.data);
  },
  
  /**
   * Lấy chi tiết của một đơn hàng cụ thể bằng ID.
   * @param id - ID của đơn hàng.
   */
  getById: (id: number): Promise<ApiResponse<Order>> => {
    const url = `/orders/${id}`;
    return axiosClient.get(url).then(res => res.data);
  },

  /**
   * Cập nhật trạng thái của một đơn hàng.
   * @param id - ID của đơn hàng.
   * @param idTTDH - ID của trạng thái mới.
   */
  updateStatus: (id: number, idTTDH: number): Promise<ApiResponse<Order>> => {    
    const url = `/orders/${id}/status`;
    return axiosClient.put(url, { idTTDH }).then(res => res.data);
  }
};