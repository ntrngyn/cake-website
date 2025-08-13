// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng
export interface CartItem {
  idBANH: number;
  tenBANH: string;
  hinhanhBANH: string;
  giaBANH: number;
  quantity: number; // Số lượng
}

// Định nghĩa kiểu dữ liệu cho state của slice này
export interface CartState {
  cartItems: CartItem[];
}

// --- LOGIC LƯU VÀ TẢI TỪ LOCALSTORAGE ---
// Hàm lấy giỏ hàng từ localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Could not load cart from storage", err);
    return [];
  }
};

// Hàm lưu giỏ hàng vào localStorage
const saveCartToStorage = (cartItems: CartItem[]) => {
  try {
    const serializedCart = JSON.stringify(cartItems);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    console.error("Could not save cart to storage", err);
  }
};

// --- STATE BAN ĐẦU ---
// State ban đầu được tải từ localStorage
const initialState: CartState = {
  cartItems: loadCartFromStorage(),
};


// --- TẠO SLICE ---
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducer: Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.idBANH === newItem.idBANH);

      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingItem.quantity += newItem.quantity;
        toast.info(`Đã cập nhật số lượng của ${newItem.tenBANH} trong giỏ hàng!`);
      } else {
        // Nếu chưa tồn tại, thêm mới vào
        state.cartItems.push(newItem);
        toast.success(`${newItem.tenBANH} đã được thêm vào giỏ hàng!`);
      }
      // Lưu lại vào localStorage sau khi thay đổi
      saveCartToStorage(state.cartItems);
    },

    // Reducer: Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action: PayloadAction<{ idBANH: number }>) => {
      const idToRemove = action.payload.idBANH;
      state.cartItems = state.cartItems.filter(item => item.idBANH !== idToRemove);
      toast.error(`Đã xóa sản phẩm khỏi giỏ hàng!`);
      saveCartToStorage(state.cartItems);
    },

    // Reducer: Cập nhật số lượng của một sản phẩm
    updateQuantity: (state, action: PayloadAction<{ idBANH: number; quantity: number }>) => {
      const { idBANH, quantity } = action.payload;
      const itemToUpdate = state.cartItems.find(item => item.idBANH === idBANH);

      if (itemToUpdate) {
        if (quantity > 0) {
          itemToUpdate.quantity = quantity;
        } else {
          // Nếu số lượng <= 0, xóa sản phẩm
          state.cartItems = state.cartItems.filter(item => item.idBANH !== idBANH);
        }
        saveCartToStorage(state.cartItems);
      }
    },

    // Reducer: Xóa sạch giỏ hàng
    clearCart: (state) => {
      state.cartItems = [];
      saveCartToStorage(state.cartItems);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;