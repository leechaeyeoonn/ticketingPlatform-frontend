import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// src/components/common/CategoryTabs.tsx
interface CategoryTabsProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
  onSearch?: (keyword: string) => void;
  onFilterClick?: () => void;
}

const CATEGORIES = ['전체', '콘서트', '뮤지컬', '스포츠', '전시/행사', '클래식/무용', '아동/가족'];

export default function CategoryTabs({
  selectedCategory,
  onSelect,
  onSearch,
  onFilterClick,
}: CategoryTabsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(keyword);
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-stone-950/80 backdrop-blur-md border-b border-stone-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
        {/* 왼쪽: 카테고리 탭 (알약 디자인) */}
        <nav
          className={`flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto h-full py-4 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] /* 흉측한 스크롤바 완벽 제거 */
          ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`
                px-5 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${
                  selectedCategory === category
                    ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]' // 선택됨: 보라색 배경 + 은은한 네온 효과
                    : 'bg-stone-800/50 text-stone-400 hover:bg-stone-700 hover:text-white' // 미선택: 어두운 회색 + 마우스 올리면 밝아짐
                }
              `}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* 오른쪽: 검색 및 필터 */}
        <div className="flex items-center gap-2 pl-4 border-l border-stone-800/80 ml-4 flex-shrink-0">
          {/* 검색창 영역 */}
          <div
            className={`flex items-center justify-end transition-all duration-300 ease-in-out ${
              isSearchOpen
                ? 'absolute left-0 top-0 w-full h-full px-4 bg-stone-950 md:static md:w-64 md:bg-transparent md:px-0 z-50'
                : 'w-10'
            }`}
          >
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-stone-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="공연명 검색"
                  className="w-full bg-stone-900 border border-stone-700 rounded-full py-2 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-stone-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setKeyword('');
                    if (onSearch) onSearch('');
                  }}
                  className="absolute right-3 p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            onClick={onFilterClick}
            className={`p-2.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-all ${
              isSearchOpen ? 'hidden md:block' : ''
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
