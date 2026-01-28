import { useState, useEffect } from 'react';
// ⚠️ 중요: 본인 프로젝트의 토큰 확인 함수 위치에 맞춰 경로를 수정해주세요!
// 아까 router.tsx에서 보니까 '@/auth/token'에 있는 것 같습니다.
import { isAuthenticated } from '@/auth/token';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 로드될 때 로그인 여부 체크
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };

    checkAuth();

    // (선택 사항) 만약 로그인/로그아웃 이벤트가 발생할 때 상태를 업데이트하고 싶다면
    // 여기에 이벤트 리스너 등을 추가할 수 있습니다.
    window.addEventListener('storage', checkAuth); // 다른 탭에서 로그아웃 시 동기화용
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return { isLoggedIn };
}
