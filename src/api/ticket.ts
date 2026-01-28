import client from './client';
import type { Performance } from '../types/ticket'; // 타입은 나중에 채워도 돼요 (일단 any로 하셔도 무방)

// [U-01] 공연 목록 조회
// 우리가 코드는 이렇게 짜지만, 실제로는 MSW가 이 요청을 가로채서 가짜 데이터를 줍니다.
export const getPerformances = () => client.get('/api/performances');

// [U-04] 좌석 선점
export const reserveSeat = (scheduleId: number, seatId: number) =>
  client.post('/api/reservations', { scheduleId, seatId });
