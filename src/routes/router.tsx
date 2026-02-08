import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // 👈 경비원 컴포넌트
import ContentLayout from '../layouts/ContentLayout'; // 👈 헤더/푸터 레이아웃

// 페이지들
import MainPage from '../pages/Main/MainPage';
import PerformanceDetailPage from '../pages/Detail/PerformanceDetailPage';
import SeatSelectionPage from '../pages/Reservation/SeatSelectionPage';
import PaymentPage from '../pages/Payment/PaymentPage';
import LoginPage from '../pages/auth/LoginPage'; // 👈 로그인 페이지 import 확인!

// ✅ 로그인한 사람이 /login 들어오면 메인으로 튕겨내는 로직 (기존 코드 활용)
// (sessionStorage에 토큰이 있으면 로그인된 것으로 간주)
function PublicOnlyRoute() {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  // ✅ 1. 로그인 페이지 (비로그인 유저만 접근 가능)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      // 회원가입 페이지도 여기에 넣으면 좋습니다.
      // { path: '/signup', element: <SignupPage /> },
    ],
  },

  // ✅ 2. 메인 서비스 영역 (로그인 필수!)
  // PrivateRoute가 먼저 검사하고 -> 통과하면 ContentLayout(헤더)을 보여줌 -> 그 안에 페이지 표시
  {
    element: <PrivateRoute />, // 🚧 1차 관문: 토큰 없으면 /login으로 보냄
    children: [
      {
        element: <ContentLayout />, // 🎨 2차 관문: 헤더/푸터 적용
        children: [
          {
            path: '/',
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
    ],
  },

  // ✅ 3. 없는 경로 처리 (이상한 주소는 메인으로)
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);