import client from './client';

// 👇 타입을 분리된 파일에서 가져옵니다!
import type { 
  Performance, 
  Schedule, 
  Seat, 
  ReservationResponse, 
  ReservationRequest 
} from '../types/ticket';

// [U-01] 공연 목록 조회
export const getPerformances = async () => {
  const response = await client.get<Performance[]>('/api/performances');
  return response;
};

// [U-02] 공연 상세 조회
export const getPerformanceDetail = async (id: string) => {
  const response = await client.get<Performance>(`/api/performances/${id}`);
  return response;
};

// [NEW] 스케줄 조회
export const getSchedules = async (performanceId: string) => {
  const response = await client.get<Schedule[]>(`/api/performances/${performanceId}/schedules`);
  return response.data;
};

// [U-03] 좌석 조회
export const getSeats = async (scheduleId: number) => {
  const response = await client.get<Seat[]>(`/api/schedules/${scheduleId}/seats`);
  return response.data;
};

// [U-04] 좌석 선점 (예매)
export const reserveSeat = async (userId: number, seatId: number) => {
  const body: ReservationRequest = { userId, seatId };
  const response = await client.post<ReservationResponse>('/api/reservations', body);
  return response.data;
};