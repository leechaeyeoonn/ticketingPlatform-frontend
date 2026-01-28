import { http, HttpResponse } from 'msw';

export const ticketHandlers = [
  // [U-01] 공연 목록 조회: CONCERT와 SPORTS 타입을 구분하여 응답 [cite: 7, 15]
  http.get('http://localhost:8080/api/performances', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: '2026 싸이 흠뻑쇼',
        type: 'CONCERT',
        thumbnail: 'https://via.placeholder.com/300x400',
        description: '여름의 상징, 싸이의 열정적인 무대!',
      },
      {
        id: 2,
        title: 'K리그 슈퍼매치',
        type: 'SPORTS',
        thumbnail: 'https://via.placeholder.com/300x400',
        description: '전통의 라이벌전, 승자는 누구인가?',
      },
    ]);
  }),

  // [U-02] 공연 상세 조회: 회차(Schedule) 정보를 포함 [cite: 8, 15]
  http.get('http://localhost:8080/api/performances/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      title: id === '1' ? '2026 싸이 흠뻑쇼' : 'K리그 슈퍼매치',
      type: id === '1' ? 'CONCERT' : 'SPORTS',
      location: id === '1' ? '잠실주경기장' : '서울월드컵경기장',
      schedules: [
        { id: 101, startTime: '2026-08-15T18:00:00' },
        { id: 102, startTime: '2026-08-16T18:00:00' },
      ],
    });
  }),

  // [U-03] 좌석 배치도 조회: 특정 회차(scheduleId)에 귀속된 좌석들 [cite: 9, 15]
  http.get('http://localhost:8080/api/schedules/:scheduleId/seats', () => {
    return HttpResponse.json(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        seatNumber: `${Math.floor(i / 5) + 1}-${(i % 5) + 1}`,
        isAvailable: Math.random() > 0.3, // 랜덤하게 예약 가능 상태 생성
      })),
    );
  }),

  // [U-04] 좌석 선점: 비관적 락(Lock) 성공 응답 시뮬레이션 [cite: 15, 17]
  http.post('http://localhost:8080/api/reservations', async ({ request }) => {
    const body = await request.json();
    console.log('선점 요청 데이터 (userId 포함 확인):', body); //
    return HttpResponse.json({ success: true }, { status: 201 });
  }),
];
