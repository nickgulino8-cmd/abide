import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Sprout, NotebookPen, UserRound } from 'lucide-react';
import { cx } from './ui';

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/faith', label: 'Faith', icon: BookOpen },
  { to: '/journey', label: 'Journey', icon: Sprout },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function TabBar() {
  return (
    <nav aria-label="Main" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/80 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-xl grid-cols-5 px-2">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cx('flex flex-col items-center gap-1 py-2.5 text-[0.68rem] font-medium tracking-wide transition', isActive ? 'text-forest' : 'text-ink-faint hover:text-ink-soft')
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cx('grid h-8 w-12 place-items-center rounded-full transition', isActive && 'bg-sage-soft')}>
                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
