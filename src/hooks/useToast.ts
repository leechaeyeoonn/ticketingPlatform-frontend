// src/hooks/useToast.ts
import { useToastStore } from '@/store/toastStore';

export function useToast() {
  const { showToast, hideToast } = useToastStore();
  return { showToast, hideToast };
}
