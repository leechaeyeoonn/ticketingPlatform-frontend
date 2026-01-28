import { Outlet } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import Footer from './components/Footer';

export default function ContentLayout() {
  return (
    <div className="min-h-dvh w-full bg-slate-50 text-slate-900">
      <div className="flex min-h-dvh w-full">
        {/* 왼쪽 사이드바 */}
        <aside className="w-80 shrink-0 border-r border-slate-200 bg-white">
          <SideMenu />
        </aside>

        {/* 오른쪽 본문 */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="min-w-0 bg-slate-50 flex-1 p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
