import { homeUiLabStates, type HomeUiLabState } from '../fixtures/home';

export const DEFAULT_HOME_UI_LAB_STATE: HomeUiLabState = 'normal';

export function getHomeUiLabState(hash = getCurrentHash()): HomeUiLabState {
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  const queryStart = hashContent.indexOf('?');
  const query = queryStart === -1 ? '' : hashContent.slice(queryStart + 1);
  const requestedState = new URLSearchParams(query).get('uilabState');

  return isHomeUiLabState(requestedState)
    ? requestedState
    : DEFAULT_HOME_UI_LAB_STATE;
}

function isHomeUiLabState(value: string | null): value is HomeUiLabState {
  return value !== null && homeUiLabStates.includes(value as HomeUiLabState);
}

function getCurrentHash(): string {
  return typeof window === 'undefined' ? '' : window.location.hash;
}
