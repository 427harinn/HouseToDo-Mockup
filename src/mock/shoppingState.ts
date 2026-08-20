import { shoppingUiLabStates, type ShoppingUiLabState } from '../fixtures/shopping';

export const DEFAULT_SHOPPING_UI_LAB_STATE: ShoppingUiLabState = 'normal';

export function getShoppingUiLabState(hash = getCurrentHash()): ShoppingUiLabState {
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  const queryStart = hashContent.indexOf('?');
  const query = queryStart === -1 ? '' : hashContent.slice(queryStart + 1);
  const requestedState = new URLSearchParams(query).get('uilabState');

  return requestedState && shoppingUiLabStates.includes(requestedState as ShoppingUiLabState)
    ? (requestedState as ShoppingUiLabState)
    : DEFAULT_SHOPPING_UI_LAB_STATE;
}

function getCurrentHash(): string {
  return typeof window === 'undefined' ? '' : window.location.hash;
}
