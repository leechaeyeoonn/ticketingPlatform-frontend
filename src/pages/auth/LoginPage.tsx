// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '@/api/axios'; // ✅ 너 프로젝트의 axios 인스턴스 (res.data만 반환하도록 인터셉터 되어있음)

type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  user: { id: number; name: string; email: string };
};

export default function LoginPage() {
  const navigate = useNavigate();

  // ✅ 입력값 state
  const [email, setEmail] = useState('test@nflux.com');
  const [password, setPassword] = useState('1234');

  // ✅ UI 상태
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onLogin = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // ✅ baseURL이 /api 라면 여기 url은 /api 붙이면 안 됨 (중복되어 /api/api/... 될 수 있음)
      const data = await http.post<LoginResponse, LoginResponse>('/auth/login', {
        email,
        password,
      });

      // ✅ axios.ts에서 getAccessToken()이 sessionStorage 'accessToken' 읽으니까 키 동일하게 저장
      sessionStorage.setItem('accessToken', data.accessToken);

      // ✅ 로그인 성공 후 이동
      navigate('/admin', { replace: true });
    } catch (e: any) {
      // ✅ 너 axios.ts가 ApiError로 표준화해서 reject 하니까 보통 e.message에 메시지가 들어옴
      setErrorMsg(e?.message ?? '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">Shopping App</h1>

        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="px-5 py-7">
            <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              placeholder="test@nflux.com"
              autoComplete="email"
            />

            <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full"
              placeholder="1234"
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onLogin();
              }}
            />

            {/* ✅ 에러 메시지 */}
            {errorMsg && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={onLogin}
              disabled={loading}
              className="transition duration-200 bg-blue-500 hover:bg-blue-600
                         focus:bg-blue-700 focus:shadow-sm focus:ring-4
                         focus:ring-blue-500 focus:ring-opacity-50 text-white
                         w-full py-2.5 rounded-lg text-sm shadow-sm
                         hover:shadow-md font-semibold text-center inline-block mb-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="inline-block mr-2">{loading ? 'Logging in...' : 'Login'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => navigate('/signup', { replace: true })}
              className="transition duration-200 bg-blue-500 hover:bg-blue-600
                         focus:bg-blue-700 focus:shadow-sm focus:ring-4
                         focus:ring-blue-500 focus:ring-opacity-50 text-white
                         w-full py-2.5 rounded-lg text-sm shadow-sm
                         hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Sign up</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            {/* ✅ 실습 안내(원하면 제거) */}
            <p className="mt-3 text-xs text-gray-500">
              테스트 계정: <b>test@nflux.com</b> / <b>1234</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
