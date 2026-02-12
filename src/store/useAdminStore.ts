import { create } from 'zustand';

interface DashboardStats {
  dailySales: number;
  activeUsers: number;
  totalPerformances: number;
}

interface AdminState {
  stats: DashboardStats;
  pendingApprovals: any[]; // 공연 등록 승인 대기 목록

  // Actions
  fetchDashboard: () => Promise<void>;
  approvePerformance: (id: number) => void;
  rejectPerformance: (id: number) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: { dailySales: 0, activeUsers: 0, totalPerformances: 0 },
  pendingApprovals: [],

  fetchDashboard: async () => {
    // 관리자 API 호출
  },
  approvePerformance: (id) => {
    // 승인 로직
  },
  rejectPerformance: (id) => {
    // 거절 로직
  },
}));
