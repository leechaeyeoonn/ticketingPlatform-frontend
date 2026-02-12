import { create } from 'zustand';

// ✅ TicketData 타입 정의 (MyTicketPage에서 이동)
export interface TicketData {
  reservationId: number;
  title: string;
  date: string;
  time: string;
  seat: string;
  grade: string;
  price: number;
  poster: string;
}

export interface TicketBookStats {
  totalCount: number;
  totalSpent: number;
  mostWatchedGenre: string;
}

export interface Waitlist {
  id: number;
  performanceTitle: string;
  targetDate: string;
  status: 'WAITING' | 'AVAILABLE' | 'EXPIRED';
}

interface MyTicketState {
  myTickets: TicketData[]; // ✅ 타입 적용
  stats: TicketBookStats;
  waitlist: Waitlist[];

  // Actions
  loadMyData: () => Promise<void>;
  cancelReservation: (reservationId: number) => void; // ✅ 예매 취소 액션 추가
  cancelWaitlist: (waitlistId: number) => void;
}

export const useMyTicketStore = create<MyTicketState>((set) => ({
  myTickets: [],
  stats: { totalCount: 0, totalSpent: 0, mostWatchedGenre: '' },
  waitlist: [],

  loadMyData: async () => {
    // ✅ localStorage에서 데이터 로드 (API 호출 시뮬레이션)
    const saved = localStorage.getItem('myTickets');
    const tickets: TicketData[] = saved ? JSON.parse(saved) : [];

    // ✅ 통계 계산 (간단한 예시)
    const stats = {
      totalCount: tickets.length,
      totalSpent: tickets.reduce((acc, t) => acc + t.price, 0),
      mostWatchedGenre: 'CONCERT', // 실제로는 카테고리 분석 로직 필요
    };

    set({ myTickets: tickets, stats });
  },

  cancelReservation: (id) =>
    set((state) => {
      const updatedTickets = state.myTickets.filter((t) => t.reservationId !== id);

      // localStorage 동기화
      localStorage.setItem('myTickets', JSON.stringify(updatedTickets));

      // 통계 업데이트 (취소 반영)
      const newStats = {
        ...state.stats,
        totalCount: updatedTickets.length,
        totalSpent: updatedTickets.reduce((acc, t) => acc + t.price, 0),
      };

      return { myTickets: updatedTickets, stats: newStats };
    }),

  cancelWaitlist: (id) =>
    set((state) => ({
      waitlist: state.waitlist.filter((w) => w.id !== id),
    })),
}));
