import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './components/AppShell/AppShell.css';
import './components/BottomNavigation/BottomNavigation.css';
import './components/BottomSheet/BottomSheet.css';
import './styles/globals.css';
import './styles/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
