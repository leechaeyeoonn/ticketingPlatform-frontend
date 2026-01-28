import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';

// ✅ 새로 만든 티켓 페이지들 import
import MainPage from '../pages/Main/MainPage';
import PerformanceDetailPage from '../pages/Detail/PerformanceDetailPage';
import SeatSelectionPage from '../pages/Reservation/SeatSelectionPage';
import PaymentPage from '../pages/Payment/PaymentPage';
import ContentLayout from '../layouts/ContentLayout';

// 토큰 체크 함수 (기존 코드 유지)
import { isAuthenticated } from '@/auth/token'; // 경로 확인 필요

// ✅ 로그인한 사람이 /login 들어오면 튕겨내는 로직 (기존 코드 유지)
function PublicOnlyRoute() {
  const location = useLocation();
  if (isAuthenticated()) {
    // 로그인 상태라면 메인('/')으로 보냄
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  // ✅ 1. 메인 및 티켓 서비스 화면 (공개 영역)
  // 이제 '/'로 접속하면 로그인 화면 대신 메인 페이지가 뜹니다!
  {
    path: '/',
    element: <ContentLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'performance/:id',
        element: <PerformanceDetailPage />,
      },
      {
        path: 'reservation/:scheduleId',
        element: <SeatSelectionPage />,
      },
      {
        path: 'payment',
        element: <PaymentPage />,
      },
    ],
  },

  // ✅ 3. 로그인 전용 영역 (기존 로직 유지)
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },

  // ✅ 4. 없는 경로 처리
  // 이상한 주소로 들어오면 다시 메인으로 보냅니다.
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
