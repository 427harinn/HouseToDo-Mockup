export const homeUiLabStates = [
  'normal',
  'overdue',
  'assigned',
  'mixed',
  'completed-collapsed',
  'completed-open',
  'passed-collapsed',
  'passed-open',
  'completed-and-passed',
  'completed-swipe',
  'passed-swipe',
  'deleted-record-swipe',
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
  taskId: string;
  name: string;
  task: HomeTask;
  completedBy?: HomePerson;
  deleted?: boolean;
};

export type PassedTask = {
  id: string;
  taskId: string;
  name: string;
  task: HomeTask;
  assignee?: HomePerson;
  deleted?: boolean;
};

export type HomeFixture = {
  activeTasks: HomeTask[];
  completedTasks: CompletedTask[];
  passedTasks: PassedTask[];
  shoppingCount: number;
  initialCompletedOpen?: boolean;
  initialPassedOpen?: boolean;
  initialActions?: { section: 'completed' | 'passed'; taskId: string };
};
