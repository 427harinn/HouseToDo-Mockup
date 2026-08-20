import { useHashRoute } from './router';
import { AppShell } from '../components/AppShell/AppShell';
import { FoundationPage } from '../pages/FoundationPage';
import { HomePage } from '../pages/HomePage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { getHomeUiLabState } from '../mock/homeState';

export function App() {
  const route = useHashRoute();

  if (route.pathname === '/foundation') {
    return <FoundationPage routePath={route.pathname} />;
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
