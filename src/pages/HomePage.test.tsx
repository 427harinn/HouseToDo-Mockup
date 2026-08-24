import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { HomePage } from './HomePage';
import type { HomeFixture } from '../fixtures/home';

function renderHome(state = 'normal') {
  window.location.hash = `#/home?uilabState=${state}`;
  return render(<App />);
}

function swipeRow(id: string) {
  const row = document.querySelector(`[data-uilab-id="${id}"]`);
  if (!row) throw new Error(`Expected row ${id}`);
  fireEvent(row, new MouseEvent('pointerdown', { bubbles: true, clientX: 220 }));
  fireEvent(row, new MouseEvent('pointerup', { bubbles: true, clientX: 140 }));
}

describe('HomePage', () => {
  beforeEach(() => vi.useRealTimers());

  it('shows today sections in the requested order and keeps both collapsed by default', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible();
    expect(screen.getByText('ゴミをまとめる')).toBeVisible();
    expect(screen.getByText('完了済み 2')).toBeVisible();
    expect(screen.getByText('パス済み 1')).toBeVisible();
    expect(screen.getByRole('link', { name: '買い物 6件' })).toBeVisible();
    expect(screen.queryByText('朝食の片付け')).not.toBeInTheDocument();
    expect(screen.queryByText('布団を干す')).not.toBeInTheDocument();

    const order = [...document.querySelectorAll('.home-page > *')].map((element) => element.textContent ?? '');
    expect(order.findIndex((text) => text.includes('完了済み 2'))).toBeLessThan(order.findIndex((text) => text.includes('パス済み 1')));
    expect(order.findIndex((text) => text.includes('パス済み 1'))).toBeLessThan(order.findIndex((text) => text.includes('買い物 6件')));
  });

  it('completes a task, stores the actual completer, and updates the count without opening the section', () => {
    vi.useFakeTimers();
    renderHome();

    fireEvent.click(screen.getByRole('button', { name: 'ゴミをまとめるを完了' }));
    expect(document.querySelector('[data-uilab-id="normal-trash"] .is-completing')).toBeTruthy();
    act(() => vi.advanceTimersByTime(180));

    expect(screen.queryByText('ゴミをまとめる')).not.toBeInTheDocument();
    expect(screen.getByText('完了済み 3')).toBeVisible();
    expect(screen.getByText('完了済み 3').closest('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the fixed completion date in edit after completing a Home task', async () => {
    vi.useFakeTimers();
    renderHome();

    fireEvent.click(screen.getByRole('button', { name: 'ゴミをまとめるを完了' }));
    act(() => vi.advanceTimersByTime(180));
    vi.useRealTimers();

    fireEvent.click(screen.getByRole('button', { name: '完了済み 3' }));
    swipeRow('completed-normal-trash');
    fireEvent.click(screen.getByRole('button', { name: '編集' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: '家事を編集' })).toBeVisible());
    expect(screen.getByText('前回：8/20')).toBeVisible();
  });

  it('does not create a previous-completion date when a Home task is passed', async () => {
    renderHome();
    swipeRow('normal-trash');
    fireEvent.click(screen.getByRole('button', { name: 'パス' }));
    fireEvent.click(screen.getByRole('button', { name: 'パス済み 2' }));
    swipeRow('passed-normal-trash');
    fireEvent.click(screen.getByRole('button', { name: '編集' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: '家事を編集' })).toBeVisible());
    expect(screen.queryByText(/前回：/)).not.toBeInTheDocument();
  });

  it('moves a passed task to the collapsed passed section and supports expansion', () => {
    renderHome();
    swipeRow('normal-trash');
    fireEvent.click(screen.getByRole('button', { name: 'パス' }));

    expect(screen.queryByText('ゴミをまとめる')).not.toBeInTheDocument();
    expect(screen.getByText('パス済み 2')).toBeVisible();
    expect(screen.getByText('パス済み 2').closest('button')).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'パス済み 2' }));
    expect(screen.getByText('ゴミをまとめる')).toBeVisible();
    expect(screen.queryByText('パスした人')).not.toBeInTheDocument();
  });

  it('opens and collapses completed and passed sections, with newest records first', () => {
    renderHome('completed-and-passed');

    fireEvent.click(screen.getByRole('button', { name: '完了済み 2' }));
    expect(screen.getByText('朝食の片付け')).toBeVisible();
    expect(screen.getByRole('img', { name: '完了者: はる' })).toBeVisible();
    expect(screen.queryByText('今日 8:12')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'パス済み 2' }));
    expect(screen.getByText('布団を干す')).toBeVisible();
    expect(screen.getByText('観葉植物に水をあげる')).toBeVisible();
    const rows = [...document.querySelectorAll('[data-uilab-component="Home.PassedRow"]')];
    expect(rows[0]).toHaveTextContent('観葉植物に水をあげる');
    expect(rows[1].querySelector('[aria-label="担当: ゆき"]')).toBeInTheDocument();
  });

  it('restores a completed task immediately', () => {
    renderHome('completed-open');
    swipeRow('normal-completed-breakfast');
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));

    expect(screen.getByText('朝食の片付け')).toBeVisible();
    expect(screen.queryByRole('img', { name: '完了者: はる' })).not.toBeInTheDocument();
    expect(screen.getByText('「朝食の片付け」を戻しました')).toBeVisible();

  });

  it('removes only today completion history when a completed Home task is undone', () => {
    const fixture: HomeFixture = {
      activeTasks: [],
      completedTasks: [{
        id: 'completed-history-task',
        taskId: 'history-task',
        name: '履歴を確認する',
        task: {
          id: 'history-task',
          name: '履歴を確認する',
          deadlineText: '今日中',
          timeScope: 'date',
          completionHistory: [
            { date: '2026-08-18', outcome: 'completed' },
            { date: '2026-08-20', outcome: 'completed' },
          ],
        },
        completedBy: { id: 'haru', name: 'はる', initials: 'は' },
      }],
      passedTasks: [],
      initialCompletedOpen: true,
    };
    const onSessionChange = vi.fn();
    render(<HomePage state="completed-open" session={fixture} onSessionChange={onSessionChange} />);

    swipeRow('completed-history-task');
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));

    const nextFixture = onSessionChange.mock.calls.at(-1)?.[0] as HomeFixture;
    expect(nextFixture.activeTasks[0].completionHistory).toEqual([
      { date: '2026-08-18', outcome: 'completed' },
    ]);
  });

  it('restores a passed task with its original assignee', () => {
    renderHome('passed-open');
    expect(screen.getByText('布団を干す')).toBeVisible();
    swipeRow('normal-passed-futon');
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    expect(document.querySelector('[data-uilab-id="normal-passed-futon"] [aria-label="担当: ゆき"]')).toBeInTheDocument();
  });

  it('does nothing when a completed or passed row is tapped normally', () => {
    renderHome('completed-open');
    fireEvent.click(screen.getByText('朝食の片付け'));
    expect(screen.getByText('朝食の片付け')).toBeVisible();
    expect(screen.queryByRole('button', { name: '戻す' })).not.toBeInTheDocument();
  });

  it('uses the unfinished row color pair for history edit and restore actions', () => {
    renderHome('completed-open');
    swipeRow('normal-completed-breakfast');

    const actions = document.querySelector('[data-uilab-id="normal-completed-breakfast"] .home-task-row__actions');
    expect(actions?.querySelector('button:not(.is-restore)')).toHaveTextContent('編集');
    expect(actions?.querySelector('.is-restore')).toHaveTextContent('戻す');
    expect(actions?.querySelector('.is-restore')).not.toHaveClass('is-pass');
  });

  it('keeps the completed snapshot when the underlying task is edited', async () => {
    renderHome('completed-open');
    swipeRow('normal-completed-breakfast');
    fireEvent.click(screen.getByRole('button', { name: '編集' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '家事を編集' })).toBeVisible());

    fireEvent.change(screen.getByLabelText('家事名'), { target: { value: '燃えるゴミ' } });
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    fireEvent.click(screen.getByRole('button', { name: '戻る' }));
    await waitFor(() => expect(screen.getByText('朝食の片付け')).toBeVisible());
    expect(screen.queryByText('燃えるゴミ')).not.toBeInTheDocument();
  });

  it('keeps the passed-time assignee avatar when the task is edited later', async () => {
    renderHome('passed-open');
    swipeRow('normal-passed-futon');
    fireEvent.click(screen.getByRole('button', { name: '編集' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '家事を編集' })).toBeVisible());

    fireEvent.click(screen.getByRole('button', { name: '担当: ゆき' }));
    fireEvent.click(screen.getByRole('button', { name: '誰でも' }));
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    fireEvent.click(screen.getByRole('button', { name: '戻る' }));
    await waitFor(() => expect(screen.getByText('布団を干す')).toBeVisible());
    expect(document.querySelector('[data-uilab-component="Home.PassedRow"] [aria-label="担当: ゆき"]')).toBeInTheDocument();
  });

  it('shows only restore for a deleted record and reactivates it on restore', () => {
    renderHome('deleted-record-swipe');
    expect(screen.getByRole('button', { name: '戻す' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '編集' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    expect(screen.getByText('朝食の片付け')).toBeVisible();
    expect(screen.queryByRole('img', { name: '完了者: はる' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '朝食の片付けの操作' })).toBeVisible();
  });

  it('deletes a recorded task as an inactive record and keeps only restore on Home', async () => {
    renderHome('completed-open');
    swipeRow('normal-completed-breakfast');
    fireEvent.click(screen.getByRole('button', { name: '編集' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '家事を編集' })).toBeVisible());

    fireEvent.click(screen.getByRole('button', { name: 'この家事を削除' }));
    expect(screen.getByRole('dialog', { name: '家事を削除しますか？' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '削除する' }));
    fireEvent.click(screen.getByRole('button', { name: '戻る' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '朝食の片付けの操作' }));
    expect(screen.queryByRole('button', { name: '編集' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '戻す' })).toBeVisible();
  });

  it('does not render empty completed or passed sections', () => {
    renderHome('empty');
    expect(screen.getByText('やることはありません')).toBeVisible();
    expect(screen.queryByText(/完了済み/)).not.toBeInTheDocument();
    expect(screen.queryByText(/パス済み/)).not.toBeInTheDocument();
  });
});
