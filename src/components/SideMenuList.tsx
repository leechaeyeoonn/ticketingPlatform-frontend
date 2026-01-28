import { NavLink } from 'react-router-dom';
import type { NavMenuItem } from '@/routes/navigation';

interface SideMenuListProps {
  items: NavMenuItem[];
}

function MenuLink({ to, label }: NavMenuItem) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) =>
        [
          'block rounded-md px-3 py-2 text-sm transition',
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

export default function SideMenuList({ items }: SideMenuListProps) {
  return (
    <div className="space-y-1">
      {items.map((m) => (
        <MenuLink key={m.to} {...m} />
      ))}
    </div>
  );
}
