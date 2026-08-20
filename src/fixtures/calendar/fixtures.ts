import type {
  CalendarFixture,
  CalendarPerson,
  CalendarTask,
  CalendarUiLabState,
} from './types';

const yuki: CalendarPerson = { id: 'yuki', name: 'ゆき', initials: 'ゆ' };
const haru: CalendarPerson = { id: 'haru', name: 'はる', initials: 'は' };

const baseTasks: CalendarTask[] = [
  {
    id: 'calendar-aug-04',
    name: '資源ごみを出す',
    date: '2026-08-04',
    assignee: yuki,
    deadline: true,
  },
  {
    id: 'calendar-aug-09',
    name: 'ベランダの植物に水をあげる',
    date: '2026-08-09',
  },
  {
    id: 'calendar-aug-12',
    name: '宅配便を受け取る',
    date: '2026-08-12',
    assignee: haru,
  },
  {
    id: 'calendar-aug-16',
    name: 'シーツを洗う',
    date: '2026-08-16',
  },
  {
    id: 'calendar-aug-20',
    name: 'エアコンのフィルターを掃除',
    date: '2026-08-20',
    assignee: haru,
    deadline: true,
  },
  {
    id: 'calendar-period-20',
    name: '今週のどこかでトイレ掃除',
    date: '2026-08-23',
    periodStart: '2026-08-17',
    periodEnd: '2026-08-23',
  },
  {
    id: 'calendar-aug-23',
    name: '布団を干す',
    date: '2026-08-23',
  },
  {
    id: 'calendar-aug-27',
    name: '電池を交換する',
    date: '2026-08-27',
    deadline: true,
  },
  {
    id: 'calendar-aug-31',
    name: '家計簿を確認する',
    date: '2026-08-31',
  },
];

const denseTasks: CalendarTask[] = [
  ...baseTasks,
  {
    id: 'calendar-dense-1',
    name: '洗濯物を取り込む',
    date: '2026-08-20',
  },
  {
    id: 'calendar-dense-2',
    name: '夕食の下ごしらえ',
    date: '2026-08-20',
  },
  {
    id: 'calendar-dense-3',
    name: 'ゴミ袋を補充する',
    date: '2026-08-20',
  },
  {
    id: 'calendar-dense-4',
    name: '玄関を整える',
    date: '2026-08-20',
  },
  {
    id: 'calendar-dense-5',
    name: '冷蔵庫を確認する',
    date: '2026-08-23',
  },
];

const longTextTasks: CalendarTask[] = [
  {
    id: 'calendar-long-1',
    name: '冷蔵庫の中を確認して足りない食材を買い物メモに追加する',
    date: '2026-08-06',
    assignee: haru,
  },
  {
    id: 'calendar-long-2',
    name: '週末に出す資源ごみを種類ごとに分けて玄関横にまとめておく',
    date: '2026-08-15',
    deadline: true,
  },
  {
    id: 'calendar-long-3',
    name: 'エアコンのフィルターを外して水洗いし完全に乾かして戻す',
    date: '2026-08-27',
  },
  ...baseTasks.slice(4, 7),
];

const completedHiddenTasks: CalendarTask[] = [
  ...baseTasks,
  {
    id: 'calendar-completed',
    name: '朝食の片付け',
    date: '2026-08-20',
    completed: true,
  },
  {
    id: 'calendar-passed',
    name: '窓を少し開ける',
    date: '2026-08-20',
    passed: true,
  },
];

export const calendarFixtures: Record<CalendarUiLabState, CalendarFixture> = {
  normal: { tasks: baseTasks },
  dense: { tasks: denseTasks },
  'date-open': { tasks: baseTasks, selectedDate: '2026-08-20' },
  'completed-hidden': { tasks: completedHiddenTasks },
  'long-text': { tasks: longTextTasks },
};
