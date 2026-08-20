export const calendarUiLabStates = [
  'normal',
  'dense',
  'date-open',
  'completed-hidden',
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
  assignee?: CalendarPerson;
  deadline?: boolean;
};

export type CalendarFixture = {
  tasks: CalendarTask[];
  selectedDate?: string;
};
