import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';

function renderHome(state?: string) {
  window.location.hash = state ? `#/home?uilabState=${state}` : '#/home';
  return render(<App />);
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('renders normal Home content inside the shared shell', () => {
    renderHome('normal');

    expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible();
    expect(screen.getByText('ゴミをまとめる')).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible();
    expect(screen.queryByTestId('screen-placeholder')).not.toBeInTheDocument();
  });

  it('maps task scopes to the required check states', () => {
    renderHome('mixed');

    expect(document.querySelector('[data-task-scope="overdue"]')).toHaveClass(
      'task-check--date',
      'is-overdue',
    );
    expect(document.querySelector('[data-task-scope="week"]')).toHaveClass(
      'task-check--week',
    );
    expect(document.querySelector('[data-task-scope="month"]')).toHaveClass(
      'task-check--month',
    );
    expect(document.querySelector('[data-task-scope="none"]')).toHaveClass(
      'task-check--none',
    );
    expect(screen.getByText('8/19 9:00まで')).toBeVisible();
    expect(screen.queryByText('期限超過')).not.toBeInTheDocument();
  });

  it('shows avatars only for specifically assigned tasks', () => {
    renderHome('assigned');

    expect(screen.getByRole('img', { name: '担当: ゆき' })).toBeVisible();
    expect(screen.getByRole('img', { name: '担当: はる' })).toBeVisible();
    expect(screen.getAllByRole('img', { name: /担当:/ })).toHaveLength(2);
    expect(screen.queryByText('誰でも')).not.toBeInTheDocument();
  });

  it('completes a task after the restrained check animation', () => {
    vi.useFakeTimers();
    renderHome('normal');

    fireEvent.click(screen.getByRole('button', { name: 'ゴミをまとめるを完了' }));

    expect(document.querySelector('[data-uilab-id="normal-trash"] .is-completing')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(180);
    });

    expect(screen.queryByText('ゴミをまとめる')).not.toBeInTheDocument();
    expect(screen.getByText('完了済み 3件')).toBeVisible();
  });

  it('expands and collapses completed tasks, with completed-open open by default', () => {
    const { unmount } = renderHome('normal');

    expect(screen.getByText('完了済み 2件')).toBeVisible();
    expect(screen.queryByText('朝食の片付け')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /完了済み 2件/ }));
    expect(screen.getByText('朝食の片付け')).toBeVisible();
    expect(screen.getByRole('img', { name: '完了者: はる' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /完了済み 2件/ }));
    expect(screen.queryByText('朝食の片付け')).not.toBeInTheDocument();

    unmount();
    renderHome('completed-open');
    expect(screen.getByText('朝食の片付け')).toBeVisible();
  });

  it('uses the shared more-actions pattern for completed row editing', async () => {
    renderHome('completed-open');

    const row = document.querySelector('[data-uilab-component="Home.CompletedRow"]');
    expect(row?.tagName).toBe('DIV');
    expect(document.querySelector('[data-uilab-component="Home.CompletedRow.Edit"]')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '朝食の片付けの操作' }));

    expect(screen.getByRole('button', { name: '編集' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'パス' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '編集' }));

    await waitFor(() => {
      expect(window.location.hash).toBe('#/tasks/edit');
      expect(screen.getByRole('heading', { name: '家事を編集' })).toBeVisible();
    });
  });

  it('reveals edit/pass on a left swipe and pass removes without completing', () => {
    renderHome('normal');
    const row = document.querySelector('[data-uilab-id="normal-trash"]');

    if (!row) throw new Error('Expected the normal trash task row to exist');
    fireEvent(
      row,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 220 }),
    );
    fireEvent(
      row,
      new MouseEvent('pointerup', { bubbles: true, clientX: 140 }),
    );

    expect(screen.getByRole('button', { name: '編集' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'パス' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'パス' }));
    expect(screen.queryByText('ゴミをまとめる')).not.toBeInTheDocument();
    expect(screen.getByText('完了済み 2件')).toBeVisible();
  });

  it('navigates from the shopping summary to the shopping route', async () => {
    renderHome('normal');

    fireEvent.click(screen.getByRole('link', { name: '買い物 4件' }));

    await waitFor(() => {
      expect(window.location.hash).toBe('#/shopping');
      expect(screen.getByRole('heading', { name: '買い物' })).toBeVisible();
    });
  });

  it('falls back to normal for unknown states and keeps many content in the shell scroll region', () => {
    const { unmount } = renderHome('unknown');
    expect(screen.getByText('ゴミをまとめる')).toBeVisible();
    unmount();

    renderHome('many');
    const viewport = document.querySelector('.app-shell__viewport');
    expect(viewport).toContainElement(screen.getAllByText('タオルを交換する')[0]);
    expect(viewport).not.toContainElement(screen.getByRole('navigation'));
  });

  it('renders the empty state and retains completed and shopping affordances', () => {
    renderHome('empty');

    expect(screen.getByText('やることはありません')).toBeVisible();
    expect(screen.getByText('完了済み 2件')).toBeVisible();
    expect(screen.getByRole('link', { name: '買い物 4件' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible();
  });
});
