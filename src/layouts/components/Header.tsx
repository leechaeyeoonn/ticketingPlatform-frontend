// src/layouts/components/Header.tsx
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { signOut } = useAuth();

  return (
    <header className="h-14 shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="flex flex-col">
        <div className="text-base font-semibold text-slate-900">관리자 콘솔</div>
        <div className="text-xs text-slate-500">MSW 기반 CRUD 실습</div>
      </div>

      <button onClick={signOut} className="text-sm text-slate-600 hover:text-slate-900">
        로그아웃
      </button>
    </header>
  );
}
