import { authHandlers } from './handlers/authHandlers';
import { productHandlers } from './handlers/productHandlers';
import { dashboardHandlers } from './handlers/dashboardHandlers';
// 대시보드도 있다면 추가...

export const handlers = [
  ...authHandlers, // 로그인 관련
  ...productHandlers, // 상품 관리 관련
  ...dashboardHandlers,
];
