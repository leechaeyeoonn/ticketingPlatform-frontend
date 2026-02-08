// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  // 1. 세션 스토리지에서 토큰 꺼내기
  const token = sessionStorage.getItem('accessToken');

  // 2. 토큰이 없으면 로그인 페이지로 강제 이동 (replace: 뒤로가기 방지)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. 토큰이 있으면 원래 가려던 페이지(자식 컴포넌트) 보여줌
  return <Outlet />;
}