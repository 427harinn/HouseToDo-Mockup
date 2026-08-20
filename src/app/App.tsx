import { useHashRoute } from './router';
import { FoundationPage } from '../pages/FoundationPage';

export function App() {
  const route = useHashRoute();

  if (route.pathname === '/foundation') {
    return <FoundationPage routePath={route.pathname} />;
  }

  return (
    <main className="foundation-page">
      <h1>HouseToDo Mockup</h1>
      <p>ルートが見つかりません。</p>
      <a href="#/foundation">Foundationを開く</a>
    </main>
  );
}
