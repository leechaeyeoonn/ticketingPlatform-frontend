import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';

export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  grade: UserGrade;
  point: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateGrade: (newGrade: UserGrade) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      updateGrade: (newGrade) =>
        set((state) => ({
          user: state.user ? { ...state.user, grade: newGrade } : null,
        })),
    }),
    {
      name: 'auth-storage', // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
    },
  ),
);
