import { Link } from 'react-router-dom';
import { X, Home, CreditCard, Ticket, Settings } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 h-20">
          <span className="text-xl font-bold text-stone-900 dark:text-white">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-stone-700 dark:text-stone-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">홈</span>
          </Link>
          <Link
            to="/payment"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-stone-700 dark:text-stone-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">결제 내역</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
            <p className="px-4 text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">
              My Account
            </p>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-3 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              <Ticket className="w-5 h-5" />
              <span className="font-medium">예매 확인/취소</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-3 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">설정</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
