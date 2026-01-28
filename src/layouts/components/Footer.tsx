export default function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            Toy Ticket Platform
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            © 2024 Toy Ticket. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-base text-stone-500 dark:text-stone-400">
          <a
            href="#"
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            이용약관
          </a>
          <a
            href="#"
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            개인정보처리방침
          </a>
          <a
            href="#"
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            고객센터
          </a>
        </div>
      </div>
    </footer>
  );
}
