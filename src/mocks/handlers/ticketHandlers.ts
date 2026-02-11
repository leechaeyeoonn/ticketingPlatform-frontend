import { http, HttpResponse } from 'msw';
import { PERFORMANCES_DATA } from '../data/performanceDummyData';

// ✅ 백엔드 서버 주소 (명세서 기준)
const BASE_URL = 'http://localhost:8080/api';

export const ticketHandlers = [
  // ----------------------------------------------------------------
  // [U-01] 공연 목록 조회 (데이터 그대로 유지)
  // GET /api/performances
  // ----------------------------------------------------------------
  http.get(`${BASE_URL}/performances`, () => {
    return HttpResponse.json(PERFORMANCES_DATA);
  }),

  // ----------------------------------------------------------------
  // [U-02] 공연 상세 조회 (UI용 - 데이터 그대로 유지)
  // GET /api/performances/:id
  // ----------------------------------------------------------------
  http.get(`${BASE_URL}/performances/:id`, ({ params }) => {
    const { id } = params;
    const target = PERFORMANCES_DATA.find((p) => p.id === Number(id));

    if (!target) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(target);
  }),

  // ----------------------------------------------------------------
  // [NEW] 스케줄 조회 (명세서 규격에 맞게 분리함!)
  // GET /api/performances/{id}/schedules
  // ----------------------------------------------------------------
  http.get(`${BASE_URL}/performances/:id/schedules`, ({ params }) => {
    console.log(`MSW: 공연 ${params.id}번의 스케줄 조회`);

    const { id } = params;

    // 싸이 흠뻑쇼(1)인 경우와 K리그(2)인 경우 스케줄 다르게 주기
    if (id === '1') {
      return HttpResponse.json([
        { id: 101, date: '2026-08-15', time: '18:00', round: 1 }, // 광복절 흠뻑쇼
        { id: 102, date: '2026-08-16', time: '18:00', round: 2 },
      ]);
    } else {
      return HttpResponse.json([
        { id: 201, date: '2026-08-20', time: '19:30', round: 1 }, // 평일 저녁 축구
      ]);
    }
  }),

  // ----------------------------------------------------------------
  // [U-03] 좌석 조회 (필드명 'isReserved'로 변경)
  // GET /api/schedules/{scheduleId}/seats
  // ----------------------------------------------------------------
  http.get(`${BASE_URL}/schedules/:scheduleId/seats`, ({ params }) => {
    console.log(`MSW: 스케줄 ${params.scheduleId}번 좌석 조회`);

    // 20개 좌석 생성 (기존 로직 유지하되 필드명만 명세서에 맞춤)
    return HttpResponse.json(
      Array.from({ length: 20 }, (_, i) => {
        // 30% 확률로 이미 예약된(isReserved: true) 좌석 생성
        const isReserved = Math.random() < 0.3;

        return {
          id: i + 1, // seatId
          seatNumber: `${Math.floor(i / 5) + 1}-${(i % 5) + 1}`, // 1-1, 1-2 형식 유지
          price: 150000, // 가격 추가
          grade: 'VIP', // 등급 추가
          isReserved: isReserved, // 🚨 [중요] 명세서 기준: true면 예약 불가
        };
      }),
    );
  }),

  // ----------------------------------------------------------------
  // [U-04] 예매 요청 (명세서 일치)
  // POST /api/reservations
  // ----------------------------------------------------------------
  http.post(`${BASE_URL}/reservations`, async () => {
    return HttpResponse.json({
      // 👇 이 필드들이 React 코드랑 똑같아야 합니다!
      status: 'SUCCESS', // React가 response.status 체크함
      reservationId: 12345, // React가 response.reservationId 출력함
      message: '예매 성공!',
    });
  }),
];
