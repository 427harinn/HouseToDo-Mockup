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
    const handleHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}
