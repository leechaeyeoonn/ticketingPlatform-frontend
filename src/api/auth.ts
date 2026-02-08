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
  // 1. 요청 보내기
  const response = await http.post<LoginResponse>('/auth/login', body);
  
  // 2. ⭐ 중요: .data를 붙이지 말고 그대로 반환하세요!
  // TypeScript 에러 방지를 위해 'as LoginResponse'로 강제 지정합니다.
  return response as unknown as LoginResponse;
}

export type MeResponse = {
  user: { id: number; name: string; email: string };
};

export async function me() {
  const response = await http.get<MeResponse>('/auth/me');
  return response as unknown as MeResponse;
}

export type LogoutResponse = { ok: true };

export function logout() {
  return http.post<LogoutResponse>('/auth/logout');
}