import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  likedPerformanceIds: string[];
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
}

export const useUserStore = create(
  persist<UserStore>(
    (set, get) => ({
      likedPerformanceIds: [],
      toggleLike: (id) =>
        set((state) => {
          const isLiked = state.likedPerformanceIds.includes(id);
          return {
            likedPerformanceIds: isLiked
              ? state.likedPerformanceIds.filter((pid) => pid !== id)
              : [...state.likedPerformanceIds, id],
          };
        }),
      isLiked: (id) => get().likedPerformanceIds.includes(id),
    }),
    {
      name: 'user-preferences', // localStorage에 저장될 키 이름
    },
  ),
);
