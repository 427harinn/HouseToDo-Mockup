import { uiLabStates, type UiLabState } from '../fixtures';

export const DEFAULT_UI_LAB_STATE: UiLabState = 'normal';

export function getUiLabState(hash = getCurrentHash()): UiLabState {
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  const queryStart = hashContent.indexOf('?');
  const query = queryStart === -1 ? '' : hashContent.slice(queryStart + 1);
  const requestedState = new URLSearchParams(query).get('uilabState');

  return isUiLabState(requestedState) ? requestedState : DEFAULT_UI_LAB_STATE;
}

function isUiLabState(value: string | null): value is UiLabState {
  return value !== null && uiLabStates.includes(value as UiLabState);
}

function getCurrentHash(): string {
  return typeof window === 'undefined' ? '' : window.location.hash;
}
