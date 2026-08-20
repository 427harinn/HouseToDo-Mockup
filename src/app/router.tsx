import { useEffect, useState } from 'react';

export type HashRoute = {
  pathname: string;
  searchParams: URLSearchParams;
};

export function getHashRoute(hash: string): HashRoute {
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  const [pathname = '/', query = ''] = hashContent.split('?', 2);

  return {
    pathname: pathname || '/',
    searchParams: new URLSearchParams(query),
  };
}

export function useHashRoute(): HashRoute {
  const readRoute = () => getHashRoute(window.location.hash);
  const [route, setRoute] = useState<HashRoute>(readRoute);

  useEffect(() => {
    let lastHash = window.location.hash;
    const handleHashChange = () => {
      // UI Lab v1 discovers Adapter elements on iframe load. Hash navigation
      // otherwise keeps the same document and leaves discovery on the prior
      // screen. Keep normal standalone preview navigation client-side, while
      // reloading only when this mockup is embedded in UI Lab.
      if (window.parent !== window) {
        lastHash = window.location.hash;
        window.location.reload();
        return;
      }
      setRoute(readRoute());
    };
    window.addEventListener('hashchange', handleHashChange);

    const embeddedRoutePoller = window.parent !== window
      ? window.setInterval(() => {
          if (window.location.hash === lastHash) return;
          lastHash = window.location.hash;
          window.location.reload();
        }, 50)
      : undefined;

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (embeddedRoutePoller !== undefined) window.clearInterval(embeddedRoutePoller);
    };
  }, []);

  return route;
}
