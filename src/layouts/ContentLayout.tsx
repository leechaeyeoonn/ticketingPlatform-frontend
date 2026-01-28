import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import Footer from './components/Footer';

export default function ContentLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      {/* Sidebar (Drawer) */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
