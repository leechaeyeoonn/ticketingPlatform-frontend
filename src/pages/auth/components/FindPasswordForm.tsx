// src/pages/Auth/components/FindPasswordForm.tsx
export default function FindPasswordForm() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
        가입하신 이메일 주소를 입력해 주세요.<br/>
        해당 이메일로 비밀번호 재설정 링크를 보내드립니다.
      </p>
      
      <div>
        <label className="block text-xs text-stone-500 mb-1 ml-1">이메일</label>
        <input 
          type="email" 
          placeholder="example@email.com" 
          className="w-full p-3 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-stone-950 dark:border-stone-700 dark:text-white"
        />
      </div>

      <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-md">
        전송하기
      </button>
    </div>
  );
}