// src/pages/Auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/api/auth';
import AuthModalManager from '@/components/auth/AuthModalManager';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  // 🚨 [여기가 범인이었습니다!] 이 줄이 없어서 에러가 난 겁니다.
  // ✅ [해결] 모달 상태를 관리하는 state가 빠져있었습니다.
  const [modalType, setModalType] = useState<'FIND_PW' | 'SIGNUP' | null>(null);

  // 로그인 폼 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // API 요청
      const response = await login({ email, password });

      console.log('서버 응답:', response); // 디버깅용 로그

      // 토큰 꺼내기 (구조에 따라 유연하게 대처)
      const token = (response as any).accessToken || (response as any).data?.accessToken;
      const user = (response as any).user || (response as any).data?.user;

      if (!token) throw new Error('토큰을 찾을 수 없습니다.');

      loginAction(user, token);

      console.log('✅ 로그인 성공! 메인으로 이동');
      navigate('/');
    } catch (err: any) {
      console.error('❌ 로그인 에러:', err);
      // 404 에러가 뜨면 여기서 잡힘
      setError('서버 연결에 실패했습니다. (API 주소를 확인해주세요)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Toy Ticket
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">로그인</h2>
        </div>

        {/* 폼 */}
        <div className="bg-stone-900 py-8 px-6 shadow-2xl rounded-2xl border border-stone-800 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-stone-700 rounded-lg bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="test@nflux.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-stone-700 rounded-lg bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1234"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-900/50">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 모달 버튼들 */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              onClick={() => setModalType('FIND_PW')} // 이제 modalType이 있어서 에러 안 남!
              className="font-medium text-stone-500 hover:text-stone-300"
            >
              비밀번호 찾기
            </button>
            <button
              onClick={() => setModalType('SIGNUP')}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>

      {/* 모달 매니저 */}
      <AuthModalManager modalType={modalType} onClose={() => setModalType(null)} />
    </div>
  );
}
