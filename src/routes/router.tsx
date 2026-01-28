import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '../auth/AuthGuard';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// ✅ (선택) 로그인 상태에서 /login 접근하면 튕기게 하고 싶으면 아래 컴포넌트 추가
import { isAuthenticated } from '../auth/token';
import { Outlet, useLocation } from 'react-router-dom';

function PublicOnlyRoute() {
  const location = useLocation();
  if (isAuthenticated()) {
    const from = (location.state as any)?.from?.pathname ?? '/admin';
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  // ✅ 1. 최초 진입(/) → 로그인 여부에 따라 분기
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },

  // ✅ 2) 로그인 전 영역
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },

  // ✅ 4. 없는 경로 → 로그인으로
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
