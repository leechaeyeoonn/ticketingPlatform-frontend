// src/api/performance.ts

// 공연 상세 데이터 타입 정의
export interface PerformanceDetail {
  id: string;
  title: string;
  category: 'CONCERT' | 'SPORTS' | 'MUSICAL';
  posterUrl: string;
  date: string;
  place: string;
  price: number;
  runningTime: string;
  ageLimit: string;
  description: string;
  cast?: { name: string; role: string; imageUrl: string }[];
}

// 임의의 JSON 데이터 (DB 대용)
const MOCK_DB: Record<string, PerformanceDetail> = {
  '1': {
    id: '1',
    title: '2026 싸이 흠뻑쇼 - SUMMER SWAG',
    category: 'CONCERT',
    posterUrl: 'https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg', // 임시 이미지
    date: '2026.07.20 (토) ~ 2026.08.20 (일)',
    place: '서울 잠실 올림픽 주경기장',
    price: 165000,
    runningTime: '240분',
    ageLimit: '전체 관람가',
    description: '여름의 상징, 싸이의 열정적인 무대! 준비물은 파란 옷과 지치지 않는 체력입니다. 역대급 물량 공세와 함께 무더위를 날려버리세요.',
    cast: [
      { name: '싸이', role: 'Main Artist', imageUrl: 'https://placehold.co/100x100?text=PSY' },
      { name: '성시경', role: 'Guest', imageUrl: 'https://placehold.co/100x100?text=Guest' },
    ],
  },
  '2': {
    id: '2',
    title: 'K리그 슈퍼매치: FC서울 vs 수원삼성',
    category: 'SPORTS',
    posterUrl: 'https://cdn.pixabay.com/photo/2016/11/29/02/05/audience-1866738_1280.jpg',
    date: '2026.05.05 (화) 14:00',
    place: '서울 월드컵 경기장',
    price: 45000,
    runningTime: '110분 (하프타임 포함)',
    ageLimit: '전체 관람가',
    description: '대한민국 축구의 가장 뜨거운 라이벌 전! 상암벌에서 펼쳐지는 자존심을 건 한판 승부.',
  },
};

// 가짜 API 호출 함수 (0.5초 딜레이 흉내)
export const fetchPerformanceDetail = async (id: string): Promise<PerformanceDetail> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DB[id];
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Performance not found'));
      }
    }, 500);
  });
};