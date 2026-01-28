export const ACCESS_TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
