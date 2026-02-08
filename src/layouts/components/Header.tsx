import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Menu, Search, User, Sun, Moon } from 'lucide-react';
import { useState } from 'react'; 
import AuthModalManager from '@/components/auth/AuthModalManager'; 

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // ✅ 1. 모달 상태 관리
  const [modalType, setModalType] = useState<'PROFILE' | null>(null);

  // ✅ 2. 로그인 정보 확인
  const isLoggedIn = !!sessionStorage.getItem('accessToken');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  // ✅ 3. 유저 아이콘 클릭 핸들러
  const handleUserClick = () => {
    if (isLoggedIn) {
      // 로그인 상태면 -> 프로필 모달 열기
      setModalType('PROFILE');
    } else {
      // 비로그인 상태면 -> 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-50/80 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            
            {/* Left: Menu Button & Logo (기존 유지) */}
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuClick}
                className="p-2 -ml-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link
                to="/"
                className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600 dark:from-fuchsia-400 dark:to-violet-500"
              >
                Toy Ticket
              </Link>
            </div>

            {/* Center: Search Bar (기존 유지) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-full leading-5 bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-colors"
                  placeholder="공연, 전시, 장소 검색"
                />
              </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              {/* 테마 토글 (기존 유지) */}
              <button
                onClick={toggleTheme}
                className="p-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* ✅ 유저 버튼 (기능 추가됨) */}
              <button
                onClick={handleUserClick} // 클릭 시 로그인 여부에 따라 동작
                className="p-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors flex items-center justify-center"
                aria-label="User Profile"
              >
                {isLoggedIn ? (
                  // 로그인 했을 때: 그라데이션 테두리가 있는 이니셜 아바타
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-stone-900 dark:text-stone-200">
                        {user.name?.[0] || 'U'}
                      </span>
                    </div>
                  </div>
                ) : (
                  // 로그인 안 했을 때: 기존 User 아이콘
                  <User className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ 모달 매니저 추가 (헤더 바깥쪽이지만 Fragment 안이라 괜찮음) */}
      <AuthModalManager 
        modalType={modalType} 
        onClose={() => setModalType(null)} 
      />
    </>
  );
}