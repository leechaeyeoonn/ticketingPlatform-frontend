import { logout as logoutApi } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await logoutApi(); // MSW or 실서버
    } catch {
      // 서버 실패해도 프론트 로그아웃은 진행
    } finally {
      sessionStorage.removeItem('accessToken');
      navigate('/login', { replace: true });
    }
  };

  return { signOut };
}
