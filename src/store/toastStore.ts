// src/store/toastStore.ts
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastStore {
  message: string | null;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  type: 'success',
  isVisible: false,
  showToast: (message, type = 'success') => {
    set({ message, type, isVisible: true });

    // 3초 뒤 자동으로 사라짐
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },
  hideToast: () => set({ isVisible: false }),
}));
