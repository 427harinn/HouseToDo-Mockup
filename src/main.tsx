import { StrictMode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './components/AppShell/AppShell.css';
import './components/BottomNavigation/BottomNavigation.css';
import './components/BottomSheet/BottomSheet.css';
import './pages/HomePage.css';
import './pages/CalendarPage.css';
import './pages/ShoppingPage.css';
import './pages/FormPage.css';
import './pages/OtherPage.css';
import './pages/EntryPage.css';
import './styles/globals.css';
import './styles/tokens.css';

const root = createRoot(document.getElementById('root')!);
flushSync(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
