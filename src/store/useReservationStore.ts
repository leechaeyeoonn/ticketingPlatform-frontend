import { create } from 'zustand';

// 기존 types/ticket.ts의 Seat 타입을 확장하거나 대체
export interface Seat {
  id: number;
  seatNumber: string;
  grade: string;
  price: number;
  isReserved: boolean;
  x?: number; // 미니맵 좌표 (추후 사용)
  y?: number; // 미니맵 좌표 (추후 사용)
}

interface ReservationState {
  performanceId: string | null;
  scheduleId: number | null;
  step: 1 | 2 | 3; // 1: 일정선택, 2: 좌석선택, 3: 결제
  selectedSeats: Seat[]; // 다중 선택 지원

  // Actions
  startReservation: (performanceId: string) => void;
  setSchedule: (scheduleId: number) => void;
  toggleSeat: (seat: Seat) => void;
  resetReservation: () => void;
  setStep: (step: 1 | 2 | 3) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  performanceId: null,
  scheduleId: null,
  step: 1,
  selectedSeats: [],

  startReservation: (id) => set({ performanceId: id, step: 1, selectedSeats: [] }),

  setSchedule: (id) => set({ scheduleId: id, step: 2 }),

  toggleSeat: (seat) =>
    set((state) => {
      const isSelected = state.selectedSeats.find((s) => s.id === seat.id);

      // 이미 선택된 좌석이면 해제
      if (isSelected) {
        return { selectedSeats: state.selectedSeats.filter((s) => s.id !== seat.id) };
      }

      // 최대 4매 제한
      if (state.selectedSeats.length >= 4) {
        alert('최대 4매까지 선택 가능합니다.');
        return state;
      }

      return { selectedSeats: [...state.selectedSeats, seat] };
    }),

  resetReservation: () =>
    set({ performanceId: null, scheduleId: null, step: 1, selectedSeats: [] }),

  setStep: (step) => set({ step }),
}));
