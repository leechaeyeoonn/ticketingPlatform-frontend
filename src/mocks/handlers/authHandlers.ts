import { http, HttpResponse } from 'msw';

type LoginRequest = {
  email: string;
  password: string;
};

const ACCESS_TOKEN = 'mock.jwt.access.token';
const TEST_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@nflux.com',
};

function getBearerToken(authHeader: string | null) {
  if (!authHeader) return null;
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

export const authHandlers = [
  // 로그인
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    if (body.email === 'test@nflux.com' && body.password === '1234') {
      return HttpResponse.json(
        {
          accessToken: ACCESS_TOKEN,
          expiresIn: 3600,
          user: TEST_USER,
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 },
    );
  }),

  // 내 정보 (토큰 있으면 OK, 없으면 401)
  http.get('/api/auth/me', ({ request }) => {
    const token = getBearerToken(request.headers.get('authorization'));
    if (token !== ACCESS_TOKEN) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ user: TEST_USER }, { status: 200 });
  }),
];
