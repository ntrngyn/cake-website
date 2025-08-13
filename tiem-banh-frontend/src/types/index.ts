// src/types/index.ts

/**
 * Định nghĩa cấu trúc chung cho một User object,
 * có thể là Khách Hàng hoặc Nhân Viên.
 */
export interface User {
  id: number;
  hotenNV?: string;
  hotenKH?: string;
  emailNV?: string;
  emailKH?: string;
  taikhoanKH?: string;
  role: string; // Sẽ là 'KhachHang' hoặc giá trị của chucvuNV
}

/**
 * Định nghĩa cấu trúc chung cho response từ API backend.
 * Sử dụng Generic Type <T> để có thể tái sử dụng cho nhiều loại dữ liệu khác nhau.
 * @template T - Kiểu dữ liệu của thuộc tính 'data'.
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Định nghĩa cấu trúc cho một sản phẩm Bánh (Cake)
 * được trả về từ API.
 */
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

/**
 * Định nghĩa cấu trúc cho một sản phẩm trong giỏ hàng.
 * Kế thừa từ Cake và thêm thuộc tính quantity.
 */
export interface CartItem extends Cake {
  quantity: number;
}

export interface DeleteResponse {
  message: string;
}