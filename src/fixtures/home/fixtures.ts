import type { HomeFixture, HomePerson, HomeTask } from './types';

const yuki: HomePerson = { id: 'yuki', name: 'ゆき', initials: 'ゆ' };
const haru: HomePerson = { id: 'haru', name: 'はる', initials: 'は' };

const normalTasks: HomeTask[] = [
  {
    id: 'normal-trash',
    name: 'ゴミをまとめる',
    deadlineText: '9:00まで',
    timeScope: 'date',
    assignee: yuki,
  },
  {
    id: 'normal-laundry',
    name: '洗濯物を取り込む',
    deadlineText: '今日中',
    timeScope: 'date',
  },
  {
    id: 'normal-bird',
    name: 'インコの餌交換',
    deadlineText: '日曜まで',
    timeScope: 'week',
  },
  {
    id: 'normal-bath',
    name: 'お風呂の排水口を掃除',
    deadlineText: '8/31まで',
    timeScope: 'month',
  },
  {
    id: 'normal-filter',
    name: '空気清浄機のフィルター',
    deadlineText: '締切なし',
    timeScope: 'none',
  },
];

const normalCompleted = [
  {
    id: 'normal-completed-breakfast',
    name: '朝食の片付け',
    completedAt: '今日 8:12',
    completedBy: haru,
  },
  {
    id: 'normal-completed-window',
    name: '窓を少し開ける',
    completedAt: '昨日 18:40',
    completedBy: yuki,
  },
];

const mixedTasks: HomeTask[] = [
  {
    id: 'mixed-overdue',
    name: '資源ごみを出す',
    deadlineText: '8/19 9:00まで',
    timeScope: 'date',
    overdue: true,
  },
  {
    id: 'mixed-date',
    name: '宅配便を受け取る',
    deadlineText: '今日中',
    timeScope: 'date',
    assignee: yuki,
  },
  {
    id: 'mixed-week',
    name: 'トイレ掃除',
    deadlineText: '日曜まで',
    timeScope: 'week',
  },
  {
    id: 'mixed-month',
    name: '電池を交換する',
    deadlineText: '8/31まで',
    timeScope: 'month',
  },
  {
    id: 'mixed-none',
    name: '家具の手入れ',
    deadlineText: '締切なし',
    timeScope: 'none',
  },
];

const manyTasks: HomeTask[] = Array.from({ length: 13 }, (_, index) => ({
  id: `many-task-${index + 1}`,
  name: ['リビングを整える', '洗面台を拭く', 'タオルを交換する'][index % 3],
  deadlineText: index < 4 ? '今日中' : index < 9 ? '日曜まで' : '締切なし',
  timeScope: index < 4 ? 'date' : index < 9 ? 'week' : 'none',
  assignee: index % 4 === 0 ? (index % 8 === 0 ? yuki : haru) : undefined,
}));

const longTextTasks: HomeTask[] = [
  {
    id: 'long-text-grocery',
    name: '冷蔵庫の中を確認して足りない食材を買い物メモに追加する',
    deadlineText: '今日中',
    timeScope: 'date',
    assignee: haru,
  },
  {
    id: 'long-text-recycling',
    name: '週末に出す資源ごみを種類ごとに分けて玄関横にまとめておく',
    deadlineText: '日曜まで',
    timeScope: 'week',
  },
  {
    id: 'long-text-maintenance',
    name: 'エアコンのフィルターを外して水洗いし、完全に乾かして戻す',
    deadlineText: '8/31まで',
    timeScope: 'month',
  },
];

export const homeFixtures: Record<
  Exclude<import('./types').HomeUiLabState, 'empty'>,
  HomeFixture
> & { empty: HomeFixture } = {
  normal: {
    activeTasks: normalTasks,
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  overdue: {
    activeTasks: [
      {
        id: 'overdue-trash',
        name: 'ゴミを出す',
        deadlineText: '8/19 9:00まで',
        timeScope: 'date',
        overdue: true,
      },
      normalTasks[1],
      normalTasks[2],
    ],
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  assigned: {
    activeTasks: [
      { ...normalTasks[0], id: 'assigned-yuki', assignee: yuki },
      { ...normalTasks[1], id: 'assigned-anyone', assignee: undefined },
      { ...normalTasks[2], id: 'assigned-haru', assignee: haru },
      { ...normalTasks[3], id: 'assigned-none', assignee: undefined },
    ],
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  mixed: {
    activeTasks: mixedTasks,
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  'completed-open': {
    activeTasks: normalTasks,
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  many: {
    activeTasks: manyTasks,
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  'long-text': {
    activeTasks: longTextTasks,
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
  empty: {
    activeTasks: [],
    completedTasks: normalCompleted,
    shoppingCount: 4,
  },
};
