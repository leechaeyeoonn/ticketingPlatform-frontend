// src/api/performance.ts
import client from './client'; // 👈 axios 설정 파일(client.ts) 경로에 맞게 맞춰주세요!

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

// ✅ 수정된 코드
export const fetchPerformanceDetail = async (id: string): Promise<PerformanceDetail> => {
  // 1. 변수명을 data에서 response(포장지)로 변경
  const response = await client.get<PerformanceDetail>(`/api/performances/${id}`);

  // 2. 포장지 안에서 알맹이(data)만 쏙 빼서 리턴!
  return response.data;
};
