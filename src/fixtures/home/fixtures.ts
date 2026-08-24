import type { CompletedTask, HomeFixture, HomePerson, HomeTask, PassedTask } from './types';

export const yuki: HomePerson = { id: 'yuki', name: 'ゆき', initials: 'ゆ' };
export const haru: HomePerson = { id: 'haru', name: 'はる', initials: 'は' };

const normalTasks: HomeTask[] = [
  { id: 'normal-trash', name: 'ゴミをまとめる', deadlineText: '9:00まで', timeScope: 'date', assignee: yuki },
  { id: 'normal-laundry', name: '洗濯物を取り込む', deadlineText: '今日中', timeScope: 'date' },
  { id: 'normal-bird', name: 'インコの餌交換', deadlineText: '日曜まで', timeScope: 'week' },
  { id: 'normal-bath', name: 'お風呂の排水口を掃除', deadlineText: '8/31まで', timeScope: 'month' },
  { id: 'normal-filter', name: '空気清浄機のフィルター', deadlineText: '締切なし', timeScope: 'none' },
];

const breakfastTask: HomeTask = { id: 'normal-completed-breakfast', name: '朝食の片付け', deadlineText: '今日中', timeScope: 'date', completionHistory: [{ date: '2026-08-18', outcome: 'completed' }] };
const windowTask: HomeTask = { id: 'normal-completed-window', name: '窓を少し開ける', deadlineText: '今日中', timeScope: 'date', completionHistory: [{ date: '2026-08-19', outcome: 'completed' }, { date: '2026-08-20', outcome: 'passed' }] };
const futonTask: HomeTask = { id: 'normal-passed-futon', name: '布団を干す', deadlineText: '今日中', timeScope: 'date', assignee: yuki };
const plantTask: HomeTask = { id: 'normal-passed-plant', name: '観葉植物に水をあげる', deadlineText: '今日中', timeScope: 'date' };

const normalCompleted: CompletedTask[] = [
  { id: breakfastTask.id, taskId: breakfastTask.id, name: breakfastTask.name, task: breakfastTask, completedBy: haru },
  { id: windowTask.id, taskId: windowTask.id, name: windowTask.name, task: windowTask, completedBy: yuki },
];
const normalPassed: PassedTask[] = [
  { id: futonTask.id, taskId: futonTask.id, name: futonTask.name, task: futonTask, assignee: futonTask.assignee },
];

const mixedTasks: HomeTask[] = [
  { id: 'mixed-overdue', name: '資源ごみを出す', deadlineText: '8/19 9:00まで', timeScope: 'date', overdue: true },
  { id: 'mixed-date', name: '宅配便を受け取る', deadlineText: '今日中', timeScope: 'date', assignee: yuki },
  { id: 'mixed-week', name: 'トイレ掃除', deadlineText: '日曜まで', timeScope: 'week' },
  { id: 'mixed-month', name: '電池を交換する', deadlineText: '8/31まで', timeScope: 'month' },
  { id: 'mixed-none', name: '家具の手入れ', deadlineText: '締切なし', timeScope: 'none' },
];

const manyTasks: HomeTask[] = Array.from({ length: 13 }, (_, index) => ({
  id: `many-task-${index + 1}`,
  name: ['リビングを整える', '洗面台を拭く', 'タオルを交換する'][index % 3],
  deadlineText: index < 4 ? '今日中' : index < 9 ? '日曜まで' : '締切なし',
  timeScope: index < 4 ? 'date' : index < 9 ? 'week' : 'none',
  assignee: index % 4 === 0 ? (index % 8 === 0 ? yuki : haru) : undefined,
}));

const longTextTasks: HomeTask[] = [
  { id: 'long-text-grocery', name: '冷蔵庫の中を確認して足りない食材を買い物メモに追加する', deadlineText: '今日中', timeScope: 'date', assignee: haru },
  { id: 'long-text-recycling', name: '週末に出す資源ごみを種類ごとに分けて玄関横にまとめておく', deadlineText: '日曜まで', timeScope: 'week' },
  { id: 'long-text-maintenance', name: 'エアコンのフィルターを外して水洗いし、完全に乾かして戻す', deadlineText: '8/31まで', timeScope: 'month' },
];

const makeFixture = (
  activeTasks: HomeTask[],
  completedTasks: CompletedTask[] = [],
  passedTasks: PassedTask[] = [],
  extra: Partial<HomeFixture> = {},
): HomeFixture => ({ activeTasks, completedTasks, passedTasks, ...extra });

const completedOnly = makeFixture(normalTasks, normalCompleted);
const passedOnly = makeFixture(normalTasks, [], normalPassed);

export const homeFixtures: Record<import('./types').HomeUiLabState, HomeFixture> = {
  normal: makeFixture(normalTasks, normalCompleted, normalPassed),
  overdue: makeFixture([mixedTasks[0], normalTasks[1], normalTasks[2]]),
  assigned: makeFixture([
    { ...normalTasks[0], id: 'assigned-yuki', assignee: yuki },
    { ...normalTasks[1], id: 'assigned-anyone', assignee: undefined },
    { ...normalTasks[2], id: 'assigned-haru', assignee: haru },
    { ...normalTasks[3], id: 'assigned-none', assignee: undefined },
  ]),
  mixed: makeFixture(mixedTasks),
  'completed-collapsed': completedOnly,
  'completed-open': makeFixture(normalTasks, normalCompleted, [], { initialCompletedOpen: true }),
  'passed-collapsed': passedOnly,
  'passed-open': makeFixture(normalTasks, [], normalPassed, { initialPassedOpen: true }),
  'completed-and-passed': makeFixture(normalTasks, normalCompleted, [
    { id: plantTask.id, taskId: plantTask.id, name: plantTask.name, task: plantTask },
    ...normalPassed,
  ]),
  'completed-swipe': makeFixture(normalTasks, normalCompleted, [], { initialCompletedOpen: true, initialActions: { section: 'completed', taskId: breakfastTask.id } }),
  'passed-swipe': makeFixture(normalTasks, [], normalPassed, { initialPassedOpen: true, initialActions: { section: 'passed', taskId: futonTask.id } }),
  'deleted-record-swipe': makeFixture(normalTasks, [{ ...normalCompleted[0], deleted: true }], [], { initialCompletedOpen: true, initialActions: { section: 'completed', taskId: breakfastTask.id } }),
  many: makeFixture(manyTasks, normalCompleted),
  'long-text': makeFixture(longTextTasks, normalCompleted),
  empty: makeFixture([]),
};
