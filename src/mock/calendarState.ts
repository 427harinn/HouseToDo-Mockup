import { calendarUiLabStates, type CalendarUiLabState } from '../fixtures/calendar';

export const DEFAULT_CALENDAR_UI_LAB_STATE: CalendarUiLabState = 'normal';

export function getCalendarUiLabState(hash = getCurrentHash()): CalendarUiLabState {
  const queryStart = hash.indexOf('?');
  const query = queryStart === -1 ? '' : hash.slice(queryStart + 1);
  const requestedState = new URLSearchParams(query).get('uilabState');

  return requestedState && calendarUiLabStates.includes(requestedState as CalendarUiLabState)
    ? (requestedState as CalendarUiLabState)
    : DEFAULT_CALENDAR_UI_LAB_STATE;
}

function getCurrentHash(): string {
  return typeof window === 'undefined' ? '' : window.location.hash;
}
