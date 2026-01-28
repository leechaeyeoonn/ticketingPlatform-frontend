// 1. 공연 타입 정의 (콘서트 vs 스포츠)
export type PerformanceType = 'CONCERT' | 'SPORTS';

// 2. 공연 (Performance) 인터페이스
// API: GET /api/performances
export interface Performance {
  id: number;
  title: string;
  type: PerformanceType;
  thumbnail: string; // U-01: 썸네일 노출
  description: string; // U-02: 설명 노출
  location: string; // U-02: 장소 노출
  // 상세 조회 시 회차 정보가 포함될 수 있음 (선택적)
  schedules?: Schedule[];
}

// 3. 회차 (Schedule) 인터페이스
// 공연의 구체적인 날짜와 시간
export interface Schedule {
  id: number;
  performanceId: number;
  startTime: string; // ISO 8601 형식 (예: "2026-08-15T18:00:00")
}

// 4. 좌석 (Seat) 인터페이스
// API: GET /api/schedules/{id}/seats
export interface Seat {
  id: number;
  scheduleId: number;
  seatNumber: string; // 예: "A-1", "VIP-3"
  isAvailable: boolean; // U-03: 예약 가능 여부 (true: 가능, false: 선점/판매됨)
  price: number; // 가격 정보 (화면에 표시하기 위해 추가)
}

// 5. 예매 요청 (Reservation Request) 인터페이스
