import type { ShoppingItem } from '../shopping';
import type { TaskHistoryEntry } from '../home';

export const calendarUiLabStates = [
  'normal',
  'dense',
  'date-open',
  'shopping',
  'date-open-shopping',
  'shopping-none',
  'completed-hidden',
  'completed-collapsed',
  'completed-open',
  'completed-swipe',
  'completed-restore',
  'deleted-completed-swipe',
  'long-text',
] as const;

export type CalendarUiLabState = (typeof calendarUiLabStates)[number];

export type CalendarPerson = {
  id: string;
  name: string;
  initials: string;
};

export type CalendarTask = {
  id: string;
  name: string;
  date: string;
  periodStart?: string;
  periodEnd?: string;
  completed?: boolean;
  passed?: boolean;
  deleted?: boolean;
  completedBy?: CalendarPerson;
  completionHistory?: TaskHistoryEntry[];
  assignee?: CalendarPerson;
  deadline?: boolean;
};

export type CalendarFixture = {
  tasks: CalendarTask[];
  shoppingItems: ShoppingItem[];
  selectedDate?: string;
  completedOpen?: boolean;
  initialActions?: { taskId: string };
};
