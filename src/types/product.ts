// 대시보드 요약 아이템 타입
export interface DashboardSummary {
  id: number;
  label: string;
  value: string;
  change: string;
  isUp: boolean;
}

// 매출 차트 데이터 타입
export interface SalesChartData {
  name: string;
  sales: number;
  orders: number;
}

// 카테고리 비중 타입
export interface CategoryData {
  name: string;
  value: number;
}

// (중요) 실제 상품 정보 타입 - 나중에 상품관리 CRUD에서 사용
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: '판매중' | '품절' | '숨김'; // 상태를 제한하여 오류 방지
  createdAt: string;
}

// API 전체 응답 규격
export interface DashboardResponse {
  summary: DashboardSummary[];
  salesChart: SalesChartData[];
  categoryData: CategoryData[];
}
