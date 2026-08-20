import { useHashRoute } from './router';
import { AppShell } from '../components/AppShell/AppShell';
import { FoundationPage } from '../pages/FoundationPage';
import { HomePage } from '../pages/HomePage';
import { CalendarPage } from '../pages/CalendarPage';
import { ShoppingPage } from '../pages/ShoppingPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { getHomeUiLabState } from '../mock/homeState';
import { getCalendarUiLabState } from '../mock/calendarState';
import { getShoppingUiLabState } from '../mock/shoppingState';
import { TaskFormPage } from '../pages/TaskFormPage';
import { ShoppingFormPage } from '../pages/ShoppingFormPage';

export function App() {
  const route = useHashRoute();

  if (route.pathname === '/foundation') {
    return <FoundationPage routePath={route.pathname} />;
  }

  if (route.pathname === '/tasks/new' || route.pathname === '/tasks/edit') {
    const isEdit = route.pathname === '/tasks/edit';
    return (
      <AppShell currentPath="" showBottomNavigation={false}>
        <TaskFormPage
          key={`${route.pathname}-${route.searchParams.get('uilabState') ?? 'normal'}`}
          isEdit={isEdit}
          state={route.searchParams.get('uilabState') ?? 'normal'}
        />
      </AppShell>
    );
  }

  if (route.pathname === '/shopping/new' || route.pathname === '/shopping/edit') {
    const isEdit = route.pathname === '/shopping/edit';
    return (
      <AppShell currentPath="" showBottomNavigation={false}>
        <ShoppingFormPage
          key={`${route.pathname}-${route.searchParams.get('uilabState') ?? 'normal'}`}
          isEdit={isEdit}
          state={route.searchParams.get('uilabState') ?? 'normal'}
        />
      </AppShell>
    );
  }

  const placeholderTitles: Record<string, string> = {
    '/home': 'ホーム',
    '/calendar': 'カレンダー',
    '/shopping': '買い物',
    '/other': 'その他',
  };
  const placeholderTitle = placeholderTitles[route.pathname];

  if (placeholderTitle) {
    if (route.pathname === '/home') {
      const homeState = getHomeUiLabState(
        `#${route.pathname}?${route.searchParams.toString()}`,
      );

      return (
        <AppShell currentPath={route.pathname}>
          <HomePage key={homeState} state={homeState} />
        </AppShell>
      );
    }

    if (route.pathname === '/calendar') {
      const calendarState = getCalendarUiLabState(
        `#${route.pathname}?${route.searchParams.toString()}`,
      );

      return (
        <AppShell currentPath={route.pathname}>
          <CalendarPage key={calendarState} state={calendarState} />
        </AppShell>
      );
    }

    if (route.pathname === '/shopping') {
      const shoppingState = getShoppingUiLabState(
        `#${route.pathname}?${route.searchParams.toString()}`,
      );

      return (
        <AppShell currentPath={route.pathname}>
          <ShoppingPage key={shoppingState} state={shoppingState} />
        </AppShell>
      );
    }

    return (
      <AppShell currentPath={route.pathname}>
        <PlaceholderPage title={placeholderTitle} />
      </AppShell>
    );
  }

  return (
    <main className="route-error-page">
      <h1>ページが見つかりません</h1>
      <p>ルートが見つかりません。</p>
      <a href="#/home">ホームを開く</a>
    </main>
  );
}
