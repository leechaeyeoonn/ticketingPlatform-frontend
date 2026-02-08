import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();

  // sessionStorage에서 유저 정보 가져오기
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: '게스트', email: '로그인이 필요합니다.' };

  const handleLogout = () => {
    // 로그아웃 처리
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      sessionStorage.clear(); // 토큰 삭제
      window.location.href = '/login'; // 새로고침하며 이동
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-2">
      
      {/* 1. 프로필 이미지 (없으면 이니셜) */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white dark:bg-stone-900 flex items-center justify-center overflow-hidden">
             {/* 이미지가 있다면 <img src={user.image} ... /> */}
             <span className="text-3xl font-bold text-stone-800 dark:text-white">
               {user.name ? user.name[0] : 'U'}
             </span>
          </div>
        </div>
        {/* 접속 상태 표시 점 */}
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-stone-900 rounded-full"></div>
      </div>

      {/* 2. 유저 정보 */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-stone-900 dark:text-white">
          {user.name} 님
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {user.email}
        </p>
      </div>

      {/* 3. 액션 버튼들 */}
      <div className="grid grid-cols-2 gap-3 w-full mt-4">
        <button 
          onClick={() => navigate('/mypage')} // 마이페이지 경로는 나중에 만드시면 됩니다
          className="py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium transition-colors dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          마이페이지
        </button>
        <button 
          onClick={handleLogout}
          className="py-2.5 px-4 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 font-medium transition-colors dark:bg-red-900/10 dark:border-red-900/30 dark:hover:bg-red-900/20"
        >
          로그아웃
        </button>
      </div>

      {/* 4. 최근 예매 내역 요약 (선택 사항) */}
      <div className="w-full pt-4 border-t border-stone-100 dark:border-stone-800">
        <p className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Activity</p>
        <div className="text-sm text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/50 p-3 rounded-lg">
          최근 예매한 티켓이 없습니다.
        </div>
      </div>
    </div>
  );
}