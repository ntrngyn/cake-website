// src/api/axiosClient.ts
import axios from 'axios';
import type { EnhancedStore } from '@reduxjs/toolkit';

let store: EnhancedStore;

// Hàm để nhận store từ bên ngoài
export const injectStore = (_store: EnhancedStore) => {
  store = _store;
};

const axiosClient = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Chỉ thực hiện logic nếu store đã được inject
    if (store) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor cho Response (Tùy chọn)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ví dụ về xử lý lỗi 401 tập trung
    if (store && error.response && error.response.status === 401) {
      // Chúng ta không thể import 'logout' ở đây vì sẽ gây vòng lặp
      // Thay vào đó, chúng ta dispatch một action type dạng chuỗi
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;