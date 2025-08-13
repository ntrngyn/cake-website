// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#d4a373', // Nâu vàng ấm
    },
    secondary: {
      main: '#faedcd', // Kem nhạt
    },
    error: {
      main: '#e85a4f', // Đỏ cam
    },
    background: {
      default: '#fefae0', // Nền trắng ngà rất nhẹ
    },
    text: {
        primary: '#3a3a3a', // Màu chữ chính
        secondary: '#6c757d', // Màu chữ phụ
    }
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif" },
    h2: { fontFamily: "'Playfair Display', serif" },
    h3: { fontFamily: "'Playfair Display', serif" },
    h4: { fontFamily: "'Playfair Display', serif" },
  },
});