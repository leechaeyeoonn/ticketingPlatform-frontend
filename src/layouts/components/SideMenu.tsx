// src/layouts/components/SideMenu.tsx
import SideMenuList from '@/components/SideMenuList';
import { navigation } from '@/routes/navigation';

export default function SideMenu() {
  return (
    <div className="h-full p-4">
      <div className="mb-6">
        <div className="text-lg font-semibold">Ticketing App</div>
        <div className="text-sm text-slate-500">티켓 예매</div>
      </div>

      <div className="space-y-6">
        {navigation.map((section) => (
          <section key={section.title} className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 px-1">{section.title}</div>
            <SideMenuList items={section.items} />
          </section>
        ))}
      </div>
    </div>
  );
}
