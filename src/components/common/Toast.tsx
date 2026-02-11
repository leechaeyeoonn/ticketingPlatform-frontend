// src/components/common/Toast.tsx
import { useToastStore } from '@/store/toastStore';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { message, type, isVisible } = useToastStore();

  if (!isVisible || !message) return null;

  // 타입별 스타일 및 아이콘 설정
  const styles = {
    success: 'bg-indigo-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-stone-800 text-white',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[9999] flex items-center gap-2 transition-all duration-500 animate-bounce ${styles[type]}`}
    >
      {icons[type]}
      <span className="font-bold">{message}</span>
    </div>
  );
}
