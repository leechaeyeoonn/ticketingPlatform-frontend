// src/components/common/Modal.tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode; // 👈 여기가 핵심! 무엇이든 들어갈 수 있는 구멍
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // ESC 키 누르면 닫히기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // Portal을 사용하여 다른 요소들보다 무조건 위에 뜨게 함
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. 배경 (Backdrop) - 흐림 효과 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* 2. 모달 본체 (Container) */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 transform transition-all scale-100 overflow-hidden">
        
        {/* 헤더 (제목 + 닫기 버튼) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 3. 내용 (Content) - 여기가 계속 바뀝니다 */}
        <div className="p-6 text-stone-600 dark:text-stone-300">
          {children}
        </div>

      </div>
    </div>,
    document.body
  );
}