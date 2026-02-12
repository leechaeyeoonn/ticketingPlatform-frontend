// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function PrivateRoute() {
  // ✅ Zustand Store에서 인증 상태를 직접 확인합니다.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. 토큰이 있으면 원래 가려던 페이지(자식 컴포넌트) 보여줌
  return <Outlet />;
}
