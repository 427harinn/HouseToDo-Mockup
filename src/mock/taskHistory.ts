import type { HomeTask } from '../fixtures/home';

export function getLastCompletedDate(task: HomeTask): string | undefined {
  return task.completionHistory
    ?.filter((entry) => entry.outcome === 'completed')
    .map((entry) => entry.date)
    .sort()
    .at(-1);
}

export function formatTaskHistoryDate(date: string): string {
  const value = new Date(`${date}T12:00:00+09:00`);
  return `${value.getMonth() + 1}/${value.getDate()}`;
}
