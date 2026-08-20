import {
  CalendarDays,
  Ellipsis,
  House,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

type NavigationItem = {
  path: string;
  label: string;
  Icon: ComponentType<LucideProps>;
};

const navigationItems: NavigationItem[] = [
  { path: '/home', label: 'ホーム', Icon: House },
  { path: '/calendar', label: 'カレンダー', Icon: CalendarDays },
  { path: '/shopping', label: '買い物', Icon: ShoppingCart },
  { path: '/other', label: 'その他', Icon: Ellipsis },
];

type BottomNavigationProps = {
  addOpen: boolean;
  currentPath: string;
  onAdd: () => void;
};

export function BottomNavigation({
  addOpen,
  currentPath,
  onAdd,
}: BottomNavigationProps) {
  return (
    <nav
      className="bottom-navigation"
      aria-label="メインナビゲーション"
      data-uilab-component="AppShell.BottomNavigation"
      data-uilab-id="app-bottom-navigation"
    >
      <div className="bottom-navigation__items">
        <NavigationLink item={navigationItems[0]} currentPath={currentPath} />
        <NavigationLink item={navigationItems[1]} currentPath={currentPath} />
        <button
          type="button"
          className="bottom-navigation__button bottom-navigation__add"
          aria-label="追加"
          aria-haspopup="dialog"
          aria-expanded={addOpen}
          onClick={onAdd}
        >
          <Plus aria-hidden="true" strokeWidth={1.8} />
        </button>
        <NavigationLink item={navigationItems[2]} currentPath={currentPath} />
        <NavigationLink item={navigationItems[3]} currentPath={currentPath} />
      </div>
    </nav>
  );
}

function NavigationLink({
  item,
  currentPath,
}: {
  item: NavigationItem;
  currentPath: string;
}) {
  const isCurrent = currentPath === item.path;
  const { Icon } = item;

  return (
    <a
      href={`#${item.path}`}
      className={`bottom-navigation__button${isCurrent ? ' is-current' : ''}`}
      aria-label={item.label}
      aria-current={isCurrent ? 'page' : undefined}
    >
      <Icon aria-hidden="true" strokeWidth={1.8} />
    </a>
  );
}
