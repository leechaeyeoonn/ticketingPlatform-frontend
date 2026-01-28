import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPerformances } from '../../api/ticket';
import type { Performance } from '../../types/ticket';

export default function MainPage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // API 호출 함수
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPerformances();
        setPerformances(response.data); // Axios 결과에서 data만 뽑기
      } catch (err) {
        console.error(err);
        setError('공연 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center text-white h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center text-red-400 h-96">{error}</div>;
  }

  return (
    <div className="w-full">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-600 dark:from-fuchsia-400 dark:to-violet-500 mb-2">
          Toy Ticket
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-xl">
          원하는 공연과 경기를 예매해보세요.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {performances.map((item) => (
            <Link
              key={item.id}
              to={`/performance/${item.id}`}
              className="group block bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all hover:-translate-y-1 border border-stone-200 dark:border-stone-800"
            >
              {/* 썸네일 영역 */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

                {/* 카테고리 배지 */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.type === 'CONCERT'
                        ? 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800 border'
                        : 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800 border'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>

              {/* 텍스트 정보 */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1 truncate text-stone-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-base text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
