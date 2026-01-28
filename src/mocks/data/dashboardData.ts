import type { DashboardSummary, SalesChartData, CategoryData } from '../../types/product';

export const mockSummary: DashboardSummary[] = [
  { id: 1, label: '총 매출', value: '₩12,540,000', change: '+12.5%', isUp: true },
  { id: 2, label: '방문자 수', value: '2,840명', change: '+5.2%', isUp: true },
  { id: 3, label: '신규 주문', value: '45건', change: '-2.1%', isUp: false },
  { id: 4, label: '문의 사항', value: '3건', change: '0%', isUp: true },
];

export const mockSalesChart: SalesChartData[] = [
  { name: '월', sales: 4000, orders: 240 },
  { name: '화', sales: 3000, orders: 198 },
  { name: '수', sales: 5000, orders: 300 },
  { name: '목', sales: 2780, orders: 208 },
  { name: '금', sales: 1890, orders: 150 },
  { name: '토', sales: 2390, orders: 180 },
  { name: '일', sales: 3490, orders: 250 },
];

export const mockCategoryData: CategoryData[] = [
  { name: '의류', value: 400 },
  { name: '전자기기', value: 300 },
  { name: '도서', value: 200 },
  { name: '기타', value: 100 },
];
