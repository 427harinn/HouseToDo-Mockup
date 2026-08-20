import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';

function renderCalendar(state?: string) {
  window.location.hash = state ? `#/calendar?uilabState=${state}` : '#/calendar';
  return render(<App />);
}

describe('CalendarPage', () => {
  it('renders a full seven-column month grid and weekend semantics', () => {
    renderCalendar('normal');

    expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible();
    expect(document.querySelectorAll('.calendar-weekday-row span')).toHaveLength(7);
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);
    expect(document.querySelectorAll('.calendar-day-number--6')).not.toHaveLength(0);
    expect(document.querySelectorAll('.calendar-day-number--0')).not.toHaveLength(0);
    expect(document.querySelectorAll('.calendar-weekday-row .is-saturday')).toHaveLength(1);
    expect(document.querySelectorAll('.calendar-weekday-row .is-sunday')).toHaveLength(1);
  });

  it('keeps today emphasis on the date number only', () => {
    renderCalendar('normal');

    const today = document.querySelector('.calendar-day-number.is-today');
    expect(today).toBeTruthy();
    expect(today?.parentElement).not.toHaveClass('is-today');
  });

  it('excludes completed and passed tasks from month cells', () => {
    renderCalendar('completed-hidden');

    expect(screen.queryByText('朝食の片付け')).not.toBeInTheDocument();
    expect(screen.queryByText('窓を少し開ける')).not.toBeInTheDocument();
    expect(screen.getByText('エアコンのフィルターを掃除')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /8月20日 木曜日/ }));
    expect(screen.getByText('完了済み 1件')).toBeVisible();
  });

  it('shows overflow as +N in the dense fixture', () => {
    renderCalendar('dense');

    expect(screen.getByText('+3')).toBeVisible();
  });

  it('opens date details from a cell and closes with the explicit control', () => {
    renderCalendar('normal');

    fireEvent.click(screen.getByRole('button', { name: /8月20日 木曜日/ }));

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByText('この日')).toBeVisible();
    expect(screen.getByText('期間中')).toBeVisible();
    expect(screen.getByText(/完了済み \d+件/)).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens date details by default in date-open and navigates by day controls', () => {
    renderCalendar('date-open');

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('heading', { name: '8月20日 木曜日' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '次の日' }));
    expect(screen.getByRole('heading', { name: '8月21日 金曜日' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '前の日' }));
    expect(screen.getByRole('heading', { name: '8月20日 木曜日' })).toBeVisible();
  });

  it('navigates date details with a horizontal swipe', () => {
    renderCalendar('date-open');
    const sheet = screen.getByRole('dialog');

    fireEvent(
      sheet,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 240 }),
    );
    fireEvent(
      sheet,
      new MouseEvent('pointerup', { bubbles: true, clientX: 160 }),
    );

    expect(screen.getByRole('heading', { name: '8月21日 金曜日' })).toBeVisible();
  });

  it('keeps the selected date when a detail task swipe opens edit/pass actions', () => {
    renderCalendar('date-open');
    const sheet = screen.getByRole('dialog');
    const task = sheet.querySelector('.calendar-detail-task');

    if (!task) throw new Error('Expected a detail task');
    fireEvent(
      task,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 240 }),
    );
    fireEvent(
      task,
      new MouseEvent('pointerup', { bubbles: true, clientX: 160 }),
    );

    expect(screen.getByRole('button', { name: '編集' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'パス' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '8月20日 木曜日' })).toBeVisible();
  });

  it('removes a detail task after the Home-style completion action', () => {
    renderCalendar('date-open');
    const taskName = 'エアコンのフィルターを掃除';

    fireEvent.click(screen.getByRole('dialog').querySelector('.calendar-detail-task__main')!);

    expect(screen.queryByText(taskName)).not.toBeInTheDocument();
    expect(screen.getByText('完了済み 1件')).toBeVisible();
  });

  it('falls back to normal and preserves the grid for long text', () => {
    const { unmount } = renderCalendar('unknown');
    expect(screen.getByText('エアコンのフィルターを掃除')).toBeVisible();
    unmount();

    renderCalendar('long-text');
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);
    expect(screen.getByText('冷蔵庫の中を確認して足りない食材を買い物メモに追加する')).toBeVisible();
  });

  it('adapts the month grid between six and five week months', () => {
    renderCalendar('normal');

    fireEvent.click(screen.getByRole('button', { name: '次の月' }));
    expect(screen.getByRole('heading', { name: '2026年9月' })).toBeVisible();
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(35);

    fireEvent.click(screen.getByRole('button', { name: '前の月' }));
    expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible();
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);
  });

  it('keeps BottomNavigation outside the Calendar content scroll region', () => {
    renderCalendar('normal');

    const viewport = document.querySelector('.app-shell__viewport');
    const navigation = screen.getByRole('navigation', { name: 'メインナビゲーション' });

    expect(viewport).toContainElement(screen.getByRole('heading', { name: '2026年8月' }));
    expect(viewport).not.toContainElement(navigation);
  });
});
