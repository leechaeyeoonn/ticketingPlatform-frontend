import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPerformances } from '../../api/ticket';
import type { Performance } from '../../types/ticket';
import CategoryTabs from '@/components/common/CategoryTabs';
import { useToast } from '@/hooks/useToast';
import { SearchX } from 'lucide-react';

export default function MainPage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState(''); // 🔍 검색어 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

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

  // ✅ 카테고리 + 검색어 필터링 로직
  const filteredPerformances = performances.filter((item) => {
    // 1. 카테고리 매칭 확인
    let isCategoryMatch = selectedCategory === '전체';
    if (!isCategoryMatch) {
      switch (selectedCategory) {
        case '콘서트':
          isCategoryMatch = item.type === 'CONCERT';
          break;
        case '뮤지컬':
          isCategoryMatch = item.type === 'MUSICAL';
          break;
        case '스포츠':
          isCategoryMatch = item.type === 'SPORTS';
          break;
        case '전시/행사':
          isCategoryMatch = item.type === 'EXHIBITION';
          break;
        case '클래식/무용':
          isCategoryMatch = item.type === 'CLASSIC';
          break;
        case '아동/가족':
          isCategoryMatch = item.type === 'FAMILY';
          break;
        default:
          isCategoryMatch = false;
      }
    }

    // 2. 검색어 매칭 확인 (제목 또는 설명)
    const isSearchMatch =
      searchKeyword === '' ||
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase());

    return isCategoryMatch && isSearchMatch;
  });

  // 필터 버튼 핸들러
  const handleFilterClick = () => {
    showToast('필터 기능은 준비 중입니다!', 'info');
  };

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
    <div className="w-full min-h-screen bg-stone-950">
      <header className="pt-12 pb-8 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-600 dark:from-fuchsia-400 dark:to-violet-500 mb-2">
          Toy Ticket
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-xl">
          원하는 공연과 경기를 예매해보세요.
        </p>
      </header>

      {/* 카테고리 탭 배치 */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        onSearch={setSearchKeyword} // 🔍 검색 핸들러 연결
        onFilterClick={handleFilterClick} // ⚙️ 필터 핸들러 연결
      />

      {/* ✅ 메인 콘텐츠: 탭과의 간격(py-12) 추가 */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {filteredPerformances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-stone-500 animate-in fade-in zoom-in duration-300">
            <div className="bg-stone-900 p-6 rounded-full mb-6">
              <SearchX className="w-12 h-12 text-stone-600" />
            </div>
            <h3 className="text-2xl font-bold text-stone-300 mb-2">
              {searchKeyword ? '검색 결과가 없습니다' : '등록된 공연이 없습니다'}
            </h3>
            <p className="text-stone-500 text-center">
              {searchKeyword
                ? `'${searchKeyword}'와(과) 일치하는 공연을 찾을 수 없습니다.`
                : '현재 선택하신 카테고리에 예매 가능한 공연이 없습니다.'}
              <br />
              다른 조건으로 다시 시도해보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPerformances.map((item) => (
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
        )}
      </main>
    </div>
  );
}
