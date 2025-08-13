// src/hooks/useRedux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';

// Sử dụng thay cho `useDispatch` mặc định
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Sử dụng thay cho `useSelector` mặc định
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;