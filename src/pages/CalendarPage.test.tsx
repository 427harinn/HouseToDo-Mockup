import { fireEvent, render, screen, within } from '@testing-library/react';
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
    expect(screen.getByText('完了済み 1')).toBeVisible();
  });

  it('shows overflow as +N in the dense fixture', () => {
    renderCalendar('dense');

    expect(screen.getByText('+3')).toBeVisible();
  });

  it('moves months with a horizontal month-grid swipe without opening a date', () => {
    renderCalendar('normal');
    const grid = document.querySelector('.calendar-month-grid');

    if (!grid) throw new Error('Expected the calendar month grid to exist');
    fireEvent(
      grid,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 240, clientY: 420 }),
    );
    fireEvent(
      grid,
      new MouseEvent('pointerup', { bubbles: true, clientX: 160, clientY: 424 }),
    );

    expect(screen.getByRole('heading', { name: '2026年9月' })).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent(
      grid,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 160, clientY: 420 }),
    );
    fireEvent(
      grid,
      new MouseEvent('pointerup', { bubbles: true, clientX: 240, clientY: 424 }),
    );

    expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible();
  });

  it('does not move months for short or vertically dominant drags', () => {
    renderCalendar('normal');
    const grid = document.querySelector('.calendar-month-grid');

    if (!grid) throw new Error('Expected the calendar month grid to exist');
    fireEvent(
      grid,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 240, clientY: 420 }),
    );
    fireEvent(
      grid,
      new MouseEvent('pointerup', { bubbles: true, clientX: 220, clientY: 424 }),
    );
    fireEvent(
      grid,
      new MouseEvent('pointerdown', { bubbles: true, clientX: 240, clientY: 420 }),
    );
    fireEvent(
      grid,
      new MouseEvent('pointerup', { bubbles: true, clientX: 220, clientY: 500 }),
    );

    expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible();
  });

  it('opens date details from a cell and closes with the explicit control', () => {
    renderCalendar('normal');

    fireEvent.click(screen.getByRole('button', { name: /8月20日 木曜日/ }));

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByText('この日')).toBeVisible();
    expect(screen.getByText('期間中')).toBeVisible();
    expect(screen.queryByText(/完了済み/)).not.toBeInTheDocument();

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
    expect(task.querySelector('.calendar-detail-task__more')).not.toBeVisible();
    expect(screen.getByRole('heading', { name: '8月20日 木曜日' })).toBeVisible();
  });

  it('removes a detail task after the Home-style completion action', () => {
    renderCalendar('date-open');
    const taskName = 'エアコンのフィルターを掃除';

    fireEvent.click(screen.getByRole('dialog').querySelector('.calendar-detail-task__main')!);

    expect(screen.queryByText(taskName)).not.toBeInTheDocument();
    expect(screen.getByText('完了済み 1')).toBeVisible();
  });

  it('keeps completed records collapsed by default and scopes them to the selected date', () => {
    renderCalendar('completed-collapsed');

    expect(screen.getByText('完了済み 1')).toBeVisible();
    expect(screen.getByText('完了済み 1').closest('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('朝食の片付け')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '完了済み 1' }));
    expect(within(screen.getByRole('dialog')).getByText('朝食の片付け')).toBeVisible();
    expect(screen.getByRole('img', { name: '完了者: はる' })).toBeVisible();
    expect(screen.queryByText(/8:\d+|期限|担当/)).not.toBeInTheDocument();
  });

  it('uses Home history interactions for Calendar completed rows', () => {
    renderCalendar('completed-swipe');

    const row = document.querySelector('[data-uilab-id="calendar-completed-open"]');
    if (!row) throw new Error('Expected a completed Calendar row');
    fireEvent(row, new MouseEvent('pointerdown', { bubbles: true, clientX: 240 }));
    fireEvent(row, new MouseEvent('pointerup', { bubbles: true, clientX: 160 }));

    expect(screen.getByRole('button', { name: '編集' })).toBeVisible();
    expect(screen.getByRole('button', { name: '戻す' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    expect(screen.getByText('完了済み 1')).toBeVisible();
    expect(within(screen.getByRole('dialog')).getByText('朝食の片付け')).toBeVisible();
  });

  it('shows restore only for a deleted completed Calendar record and re-enables it', () => {
    renderCalendar('deleted-completed-swipe');

    expect(screen.getByText('朝食の片付け')).toBeVisible();
    const row = document.querySelector('[data-uilab-id="calendar-deleted-completed"]');
    if (!row) throw new Error('Expected deleted completed Calendar row');
    fireEvent(row, new MouseEvent('pointerdown', { bubbles: true, clientX: 240 }));
    fireEvent(row, new MouseEvent('pointerup', { bubbles: true, clientX: 160 }));
    expect(screen.queryByRole('button', { name: '編集' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    expect(screen.queryByText('完了済み 1')).not.toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByText('朝食の片付け')).toBeVisible();
  });

  it('keeps the Calendar task id and selected date when editing', () => {
    renderCalendar('date-open');
    const task = screen.getByRole('dialog').querySelector('[data-uilab-id="calendar-aug-20"]');
    if (!task) throw new Error('Expected a Calendar task row');
    fireEvent(task, new MouseEvent('pointerdown', { bubbles: true, clientX: 240 }));
    fireEvent(task, new MouseEvent('pointerup', { bubbles: true, clientX: 160 }));
    fireEvent.click(screen.getByRole('button', { name: '編集' }));

    expect(window.location.hash).toContain('origin=calendar');
    expect(window.location.hash).toContain('calendarDate=2026-08-20');
    expect(window.location.hash).toContain('taskId=calendar-aug-20');
  });

  it('falls back to normal and preserves the grid for long text', () => {
    const { unmount } = renderCalendar('unknown');
    expect(screen.getByText('エアコンのフィルターを掃除')).toBeVisible();
    unmount();

    renderCalendar('long-text');
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);
    expect(screen.getByText('冷蔵庫の中を確認して足りない食材を買い物メモに追加する')).toBeVisible();
  });

  it('keeps a six-week month grid for every month', () => {
    renderCalendar('normal');

    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);

    fireEvent.click(screen.getByRole('button', { name: '次の月' }));
    expect(screen.getByRole('heading', { name: '2026年9月' })).toBeVisible();
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);
    expect(screen.getByRole('button', { name: /10月10日 土曜日/ })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '前の月' }));
    expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible();
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);

    for (let index = 0; index < 6; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: '前の月' }));
    }
    expect(screen.getByRole('heading', { name: '2026年2月' })).toBeVisible();
    expect(document.querySelectorAll('.calendar-day-cell')).toHaveLength(42);
  });

  it('keeps the six-week task capacity in September before showing +N', () => {
    renderCalendar('normal');

    fireEvent.click(screen.getByRole('button', { name: '次の月' }));

    expect(screen.getByText('玄関を掃除する')).toBeVisible();
    expect(screen.getByText('洗濯槽を回す')).toBeVisible();
    expect(screen.queryByText('調味料を補充する')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeVisible();
  });

  it('shows only active planned shopping counts in month cells and date details', () => {
    renderCalendar('date-open-shopping');

    const shoppingCount = document.querySelector('[data-uilab-id="calendar-day-2026-08-20-shopping"]');
    expect(shoppingCount).toBeVisible();
    expect(shoppingCount).toHaveTextContent('1');
    expect(shoppingCount?.querySelector('button')).toBeNull();
    expect(screen.getByRole('dialog')).toHaveTextContent('買うもの');
    expect(screen.getByRole('dialog')).toHaveTextContent('牛乳');
    expect(screen.getByRole('dialog')).not.toHaveTextContent('卵');

    fireEvent.click(screen.getByRole('button', { name: '牛乳 1本' }));
    expect(window.location.hash).toBe('#/shopping?item=shopping-milk');
  });

  it('keeps shopping counts anchored to the day cell outside the task flow', () => {
    const { unmount } = renderCalendar('shopping');
    const singleTaskMarker = document.querySelector('[data-uilab-id="calendar-day-2026-08-20-shopping"]');

    expect(singleTaskMarker?.parentElement?.classList.contains('calendar-day-cell')).toBe(true);
    expect(singleTaskMarker?.closest('.calendar-day-tasks')).toBeNull();
    expect(singleTaskMarker?.parentElement?.classList.contains('has-shopping')).toBe(true);
    unmount();

    renderCalendar('dense');
    const denseTaskMarker = document.querySelector('[data-uilab-id="calendar-day-2026-08-20-shopping"]');

    expect(screen.getByRole('button', { name: /8月20日 木曜日、タスク5件、買い物1件/ })).toBeVisible();
    expect(denseTaskMarker?.parentElement?.classList.contains('calendar-day-cell')).toBe(true);
    expect(denseTaskMarker?.closest('.calendar-day-tasks')).toBeNull();
  });

  it('does not show shopping counts when no item has a planned date', () => {
    renderCalendar('shopping-none');
    expect(document.querySelectorAll('.calendar-day-shopping')).toHaveLength(0);

    fireEvent.click(document.querySelector('[data-uilab-id="2026-08-20"]')!);
    expect(screen.queryByText('買うもの')).not.toBeInTheDocument();
  });

  it('keeps BottomNavigation outside the Calendar content scroll region', () => {
    renderCalendar('normal');

    const viewport = document.querySelector('.app-shell__viewport');
    const navigation = screen.getByRole('navigation', { name: 'メインナビゲーション' });

    expect(viewport).toContainElement(screen.getByRole('heading', { name: '2026年8月' }));
    expect(viewport).not.toContainElement(navigation);
  });
});
