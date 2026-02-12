import { create } from 'zustand';

export interface MarketTicket {
  id: number;
  originalPrice: number;
  resalePrice: number;
  performanceTitle: string;
  seatInfo: string;
  sellerId: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  date: string; // 공연 날짜 추가
}

interface MarketState {
  listings: MarketTicket[];
  isLoading: boolean; // ✅ 로딩 상태 관리
  error: string | null; // ✅ 에러 메시지 관리
  filters: {
    keyword: string;
    minPrice: number;
    maxPrice: number;
    onlyAvailable: boolean;
  };

  // Actions
  fetchListings: () => Promise<void>; // 목록 불러오기
  registerItem: (ticket: Omit<MarketTicket, 'id' | 'status'>) => Promise<void>; // 판매 등록
  purchaseTicket: (ticketId: number) => Promise<void>; // 구매 요청
  confirmTransaction: (ticketId: number) => Promise<void>; // 거래 완료
  cancelTransaction: (ticketId: number) => Promise<void>; // 거래 취소
  setFilter: (key: keyof MarketState['filters'], value: any) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  listings: [],
  isLoading: false,
  error: null,
  filters: {
    keyword: '',
    minPrice: 0,
    maxPrice: 1000000,
    onlyAvailable: true,
  },

  // 1. 판매 목록 불러오기 (초기화)
  fetchListings: async () => {
    set({ isLoading: true, error: null });
    try {
      // API 호출 시뮬레이션 (1초 지연)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 더미 데이터
      const dummyData: MarketTicket[] = [
        {
          id: 1,
          originalPrice: 120000,
          resalePrice: 100000,
          performanceTitle: '아이유 콘서트',
          seatInfo: 'VIP석 A열 5번',
          sellerId: 2,
          status: 'AVAILABLE',
          date: '2024-05-20',
        },
        {
          id: 2,
          originalPrice: 80000,
          resalePrice: 85000,
          performanceTitle: '라이온 킹',
          seatInfo: 'R석 1층 10열',
          sellerId: 3,
          status: 'AVAILABLE',
          date: '2024-06-15',
        },
      ];

      set({ listings: dummyData, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || '목록을 불러오는데 실패했습니다.', isLoading: false });
    }
  },

  // 2. 판매 등록
  registerItem: async (ticketInfo) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem: MarketTicket = {
        ...ticketInfo,
        id: Date.now(), // 임시 ID 생성
        status: 'AVAILABLE',
      };

      set((state) => ({
        listings: [newItem, ...state.listings],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: '판매 등록 중 오류가 발생했습니다.', isLoading: false });
    }
  },

  // 3. 구매 요청 (판매중 -> 거래중)
  purchaseTicket: async (ticketId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 상태 검증 (이미 팔렸거나 예약된 경우 체크)
      const targetTicket = get().listings.find((t) => t.id === ticketId);
      if (!targetTicket || targetTicket.status !== 'AVAILABLE') {
        throw new Error('구매할 수 없는 티켓입니다.');
      }

      set((state) => ({
        listings: state.listings.map((t) => (t.id === ticketId ? { ...t, status: 'RESERVED' } : t)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // 4. 거래 완료 (거래중 -> 판매완료)
  confirmTransaction: async (ticketId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      set((state) => ({
        listings: state.listings.map((t) => (t.id === ticketId ? { ...t, status: 'SOLD' } : t)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: '거래 확정 실패', isLoading: false });
    }
  },

  // 5. 거래 취소 (거래중 -> 판매중)
  cancelTransaction: async (ticketId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        listings: state.listings.map((t) =>
          t.id === ticketId ? { ...t, status: 'AVAILABLE' } : t,
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: '거래 취소 실패', isLoading: false });
    }
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}));
