import { useState } from 'react';

export default function SignupForm() {
  // 입력값 상태 관리 (필요하면 API 연동 시 사용)
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 공통 Input 스타일 (다크모드 지원)
  const inputClass = "w-full p-3 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-stone-950 dark:border-stone-700 dark:text-white dark:focus:border-indigo-500";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-stone-500 mb-1 ml-1">이름</label>
          <input 
            name="name" type="text" placeholder="홍길동" 
            className={inputClass} onChange={handleChange} 
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1 ml-1">닉네임</label>
          <input 
            name="nickname" type="text" placeholder="TicketMaster" 
            className={inputClass} onChange={handleChange} 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1 ml-1">이메일</label>
        <input 
          name="email" type="email" placeholder="example@email.com" 
          className={inputClass} onChange={handleChange} 
        />
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1 ml-1">비밀번호</label>
        <input 
          name="password" type="password" placeholder="8자 이상 입력" 
          className={inputClass} onChange={handleChange} 
        />
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1 ml-1">비밀번호 확인</label>
        <input 
          name="confirmPassword" type="password" placeholder="비밀번호 재입력" 
          className={inputClass} onChange={handleChange} 
        />
      </div>
      
      <button className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-lg shadow-lg transition-all transform active:scale-95">
        가입 완료
      </button>
    </div>
  );
}