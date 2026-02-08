// src/pages/Detail/PerformanceDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPerformanceDetail, type PerformanceDetail } from '@/api/performance';

export default function PerformanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [performance, setPerformance] = useState<PerformanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPerformanceDetail(id)
      .then((data) => {
        setPerformance(data);
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('공연 정보를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-950 text-indigo-400">Loading...</div>;
  }

  if (error || !performance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-stone-400 gap-4">
        <p>{error || '공연을 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-400 hover:underline">돌아가기</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 pb-20">
      {/* 1. 상단 배경 흐림 효과 (Hero Background) */}
      <div className="relative w-full h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30"
          style={{ backgroundImage: `url(${performance.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 2. 포스터 섹션 */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={performance.posterUrl} 
              alt={performance.title} 
              className="w-72 h-96 object-cover rounded-xl shadow-2xl border border-stone-800"
            />
          </div>

          {/* 3. 정보 섹션 */}
          <div className="flex-1 flex flex-col justify-end pb-4">
            <span className="inline-block w-fit px-3 py-1 mb-4 rounded-full text-xs font-bold bg-indigo-900/50 text-indigo-300 border border-indigo-500/30">
              {performance.category}
            </span>
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              {performance.title}
            </h1>
            
            <div className="space-y-3 text-stone-400 text-sm md:text-base">
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-stone-500">장소</span>
                <span className="text-stone-300">{performance.place}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-stone-500">공연기간</span>
                <span className="text-stone-300">{performance.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-stone-500">관람연령</span>
                <span className="text-stone-300">{performance.ageLimit}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-stone-500">가격</span>
                <span className="text-white font-bold text-xl">
                  {new Intl.NumberFormat('ko-KR').format(performance.price)}원
                </span>
              </div>
            </div>
          </div>

          {/* 4. 예매하기 카드 (PC: 우측 고정, Mobile: 하단 고정 고려) */}
          <div className="hidden md:block w-80 pt-20">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl sticky top-24">
               <h3 className="text-lg font-bold text-white mb-4">예매 가능</h3>
               <p className="text-stone-400 text-sm mb-6">원하시는 회차를 선택하여 예매를 진행하세요.</p>
               <button 
                 onClick={() => navigate(`/reservation/${id}`)}
                 className="w-full py-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
               >
                 예매하기
               </button>
            </div>
          </div>
        </div>

        {/* 5. 상세 설명 및 캐스팅 (탭 영역) */}
        <div className="mt-16 border-t border-stone-800 pt-10 grid md:grid-cols-3 gap-12">
           <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-2xl font-bold text-white mb-4">공연 소개</h3>
                <p className="text-stone-400 leading-relaxed whitespace-pre-wrap">
                  {performance.description}
                </p>
              </section>

              {performance.cast && (
                <section>
                  <h3 className="text-2xl font-bold text-white mb-4">출연진</h3>
                  <div className="flex gap-6 overflow-x-auto pb-4">
                    {performance.cast.map((person) => (
                      <div key={person.name} className="flex flex-col items-center gap-2 min-w-[100px]">
                         <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-800">
                           <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover"/>
                         </div>
                         <div className="text-center">
                           <p className="text-white font-medium text-sm">{person.name}</p>
                           <p className="text-stone-500 text-xs">{person.role}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
           </div>
        </div>
      </div>
      
      {/* 모바일 전용 하단 고정 예매 버튼 */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-stone-900 border-t border-stone-800 p-4 z-50 safe-area-bottom">
        <button 
          onClick={() => navigate(`/reservation/${id}`)}
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold shadow-lg"
        >
          예매하기
        </button>
      </div>
    </div>
  );
}