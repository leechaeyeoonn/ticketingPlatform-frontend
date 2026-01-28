// src/api/axios.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { getAccessToken, clearAccessToken } from '../auth/token';

const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL ?? '/api');

/**
 * 프론트에서 공통으로 쓰는 표준 에러 형태
 */
export type ApiError = {
  status: number;
  message: string;
  data?: unknown;
};

/**
 * axios 에러/기타 에러를 ApiError로 표준화
 */
function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const e = error as AxiosError<unknown>;
    const status = e.response?.status ?? 0;

    const dataAny = e.response?.data as any;

    const message =
      dataAny?.message ||
      dataAny?.resultMessage ||
      dataAny?.error?.message ||
      e.message ||
      '요청 중 오류가 발생했습니다.';

    return { status, message, data: e.response?.data };
  }

  return {
    status: 0,
    message: '알 수 없는 오류가 발생했습니다.',
    data: error,
  };
}

function handleUnauthorized() {
  clearAccessToken();

  const pathname = window.location.pathname;
  const search = window.location.search;

  // 이미 /login이면 무한루프 방지
  if (pathname.startsWith('/login')) return;

  const from = encodeURIComponent(pathname + search);
  window.location.replace(`/login?from=${from}`);
}

/**
 * 프로젝트 전용 axios 인스턴스
 * - baseURL: 공통 prefix
 * - timeout: 기본 타임아웃
 * - withCredentials: 쿠키 인증 확정되면 true로 변경(기본은 false 권장)
 */
export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  withCredentials: false, // ✅ 쿠키 기반 인증이면 true로
  headers: {
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * - 토큰(Authorization) 자동 부착
 * - JSON Content-Type 기본값 처리(단, FormData/GET는 제외)
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1) Authorization 토큰 방식이면 사용
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2) Content-Type: JSON 기본값
    // - GET은 Content-Type 굳이 안 넣음
    // - FormData는 axios가 boundary 포함해서 자동 세팅하도록 건드리지 않음
    const isFormData = config.data instanceof FormData;
    const method = (config.method ?? 'get').toLowerCase();

    if (!isFormData && method !== 'get' && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    return config;
  },
  (error) => Promise.reject(toApiError(error)),
);

/**
 * Response Interceptor
 * - 성공: res.data만 반환해서 api 함수/컴포넌트 코드를 단순화
 * - 실패: ApiError로 표준화해서 reject
 */
http.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  async (error: unknown) => {
    const apiError = toApiError(error);

    // ✅ 공통 처리 최소 예시
    // - 401이면 로그아웃 처리 / 로그인 이동 등은 프로젝트 정책 정해지면 여기서 처리
    if (apiError.status === 401) {
      handleUnauthorized();
    }

    return Promise.reject(apiError);
  },
);
