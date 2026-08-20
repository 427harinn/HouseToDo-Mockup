export const homeUiLabStates = [
  'normal',
  'overdue',
  'assigned',
  'mixed',
  'completed-open',
  'many',
  'long-text',
  'empty',
] as const;

export type HomeUiLabState = (typeof homeUiLabStates)[number];

export type HomeTaskTimeScope = 'date' | 'week' | 'month' | 'none';

export type HomePerson = {
  id: string;
  name: string;
  initials: string;
};

export type HomeTask = {
  id: string;
  name: string;
  deadlineText: string;
  timeScope: HomeTaskTimeScope;
  overdue?: boolean;
  assignee?: HomePerson;
};

export type CompletedTask = {
  id: string;
  name: string;
  completedAt: string;
  completedBy?: HomePerson;
};

export type HomeFixture = {
  activeTasks: HomeTask[];
  completedTasks: CompletedTask[];
  shoppingCount: number;
};
