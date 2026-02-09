// src/types/ticket.ts

// 1. 공연 타입
export type PerformanceType = 'CONCERT' | 'SPORTS';

// 2. 공연 (Performance)
// API: GET /api/performances
export interface Performance {
  id: number;
  title: string;
  type: PerformanceType;
  thumbnail: string;
  description: string;
  price: number; // 최저가 정보 등
  location?: string; // (선택) 장소
}

// 3. 스케줄 (Schedule)
// API: GET /api/performances/{id}/schedules
export interface Schedule {
  id: number;
  date: string; // "2026-08-15"
  time: string; // "18:00"
  round: number; // 회차 (예: 1회차)
  availableSeats?: number; // (선택) 잔여 좌석 수
}

// 4. 좌석 (Seat)
// API: GET /api/schedules/{id}/seats
export interface Seat {
  id: number;        // seatId (예약 요청 시 필요)
  seatNumber: string; // "1-1", "A-1" 등
  grade: string;      // "VIP", "R"
  price: number;
  
  // 🚨 [중요 수정] 백엔드 명세서는 'isReserved'를 씁니다.
  // true = 예약됨(선택불가), false = 예약가능(선택가능)
  isReserved: boolean; 
}

// 5. 예매 요청/응답 (Reservation)
// API: POST /api/reservations
export interface ReservationRequest {
  userId: number;
  seatId: number;
}

export interface ReservationResponse {
  reservationId: number;
  status: string;
  message: string;
}