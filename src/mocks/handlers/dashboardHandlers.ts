import { http, HttpResponse } from 'msw';
import * as dashboardData from '../data/dashboardData';

export const dashboardHandlers = [
  //조회
  http.get('/api/admin/dashboard', () => {
    return HttpResponse.json({
      summary: dashboardData.mockSummary,
      salesChart: dashboardData.mockSalesChart,
      categoryData: dashboardData.mockCategoryData,
    });
  }),
];
