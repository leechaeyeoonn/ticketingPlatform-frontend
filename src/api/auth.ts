// src/api/auth.ts
import { http } from './axios';

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  user: { id: number; name: string; email: string };
};

export async function login(body: LoginBody) {
  // ✅ http가 이미 res.data를 반환하므로 res가 곧 LoginResponse
  const data = await http.post<LoginResponse>('/auth/login', body);
  return data;
}

export type MeResponse = {
  user: { id: number; name: string; email: string };
};

export async function me() {
  // ✅ 마찬가지로 data가 곧 MeResponse
  const data = await http.get<MeResponse>('/auth/me');
  return data;
}

export type LogoutResponse = { ok: true };

export function logout() {
  // MSW에 /auth/logout 핸들러가 없다면 404/미스매치 날 수 있음
  return http.post<LogoutResponse>('/auth/logout');
}
