import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';

function renderRoute(path: string) {
  window.location.hash = path;
  return render(<App />);
}

describe('M6 add and edit forms', () => {
  it('navigates the center add choices to the task and shopping add routes', async () => {
    renderRoute('#/home');
    fireEvent.click(screen.getByRole('button', { name: '追加' }));
    fireEvent.click(screen.getByRole('button', { name: '家事' }));
    await waitFor(() => expect(window.location.hash).toBe('#/tasks/new'));
    expect(screen.getByRole('heading', { name: '家事を追加' })).toBeVisible();
    expect(screen.queryByRole('navigation', { name: 'メインナビゲーション' })).not.toBeInTheDocument();

    window.location.hash = '#/home';
    await waitFor(() => expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '追加' }));
    fireEvent.click(screen.getByRole('button', { name: '買い物' }));
    await waitFor(() => expect(window.location.hash).toBe('#/shopping/new'));
    expect(screen.getByRole('heading', { name: '買い物を追加' })).toBeVisible();
  });

  it('keeps start date and date visible while hiding time and notification for all-day tasks', () => {
    renderRoute('#/tasks/new?uilabState=normal');
    expect(screen.getByLabelText('開始日')).toBeVisible();
    expect(screen.getByLabelText('日付')).toBeVisible();
    expect(screen.getByLabelText('終日')).toBeChecked();
    expect(screen.queryByLabelText('時刻')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('通知')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('終日'));
    expect(screen.getByLabelText('日付')).toBeVisible();
    expect(screen.getByLabelText('時刻')).toBeVisible();
    expect(screen.getByLabelText('通知')).toBeVisible();
  });

  it('keeps repeat and assignee hit areas scoped to their own rows', () => {
    renderRoute('#/tasks/new?uilabState=normal');
    const repeatRow = document.querySelector('[data-uilab-id="task-form-repeat"]');
    const assigneeRow = document.querySelector('[data-uilab-id="task-form-assignee"]');
    expect(repeatRow).not.toBeNull();
    expect(assigneeRow).not.toBeNull();
    expect(repeatRow?.querySelector('.form-row__value')).toBeInTheDocument();
    expect(assigneeRow?.querySelector('.form-row__value')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('家事名'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports repeat choices and weekday-specific state', () => {
    renderRoute('#/tasks/new?uilabState=normal');
    fireEvent.click(screen.getByRole('button', { name: /繰り返し:/ }));
    for (const option of ['今回だけ', '毎日', '曜日を決める', '毎月○日', '今週のどこか', '今月のどこか']) {
      expect(screen.getByRole('button', { name: option })).toBeVisible();
    }
    fireEvent.click(screen.getByRole('button', { name: '曜日を決める' }));
    expect(screen.getByRole('dialog', { name: '繰り返し' })).toBeVisible();
    expect(screen.getByRole('button', { name: '火', pressed: false })).toBeVisible();
    expect(screen.getByRole('button', { name: '金', pressed: false })).toBeVisible();
    const confirmWeekdays = screen.getByRole('button', { name: '決定' });
    expect(confirmWeekdays).toBeDisabled();
    fireEvent.click(confirmWeekdays);
    expect(screen.getByRole('dialog', { name: '繰り返し' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '火', pressed: false }));
    fireEvent.click(screen.getByRole('button', { name: '金', pressed: false }));
    expect(screen.getByRole('button', { name: '火', pressed: true })).toBeVisible();
    expect(screen.getByRole('button', { name: '金', pressed: true })).toBeVisible();
    expect(confirmWeekdays).not.toBeDisabled();
    fireEvent.click(confirmWeekdays);
    expect(screen.getByText('火・金')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '繰り返し: 火・金' }));
    fireEvent.click(screen.getByRole('button', { name: '毎月○日' }));
    expect(screen.getByRole('spinbutton', { name: '毎月の日' })).toHaveValue(20);
    fireEvent.click(screen.getByRole('button', { name: '決定' }));
    expect(screen.getByRole('button', { name: '繰り返し: 毎月20日' })).toBeVisible();
  });

  it('searches the combined task reuse picker and fills the form', () => {
    renderRoute('#/tasks/new?uilabState=normal');
    fireEvent.click(screen.getByRole('button', { name: '以前の項目から選ぶ' }));
    fireEvent.change(screen.getByLabelText('以前の項目を検索'), { target: { value: 'トイレ' } });
    expect(screen.getByRole('button', { name: /トイレ掃除/ })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /トイレ掃除/ }));
    expect(screen.getByDisplayValue('トイレ掃除')).toBeVisible();
    expect(screen.getByRole('button', { name: '繰り返し: 今週のどこか' })).toBeVisible();
  });

  it('shows a selected household member after assignee selection', () => {
    renderRoute('#/tasks/new?uilabState=normal');
    fireEvent.click(screen.getByRole('button', { name: '担当: 誰でも' }));
    fireEvent.click(screen.getByRole('button', { name: /ゆき/ }));
    expect(screen.getByRole('img', { name: '担当: ゆき' })).toBeVisible();
    expect(screen.getByRole('button', { name: '担当: ゆき' })).toBeVisible();
  });

  it('keeps edit forms free of reuse and separates delete confirmation', () => {
    renderRoute('#/tasks/edit?uilabState=normal');
    expect(screen.queryByText('以前の項目から選ぶ')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'この家事を削除' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'この家事を削除' }));
    expect(screen.getByRole('dialog', { name: '家事を削除しますか？' })).toBeVisible();
    expect(screen.queryByText('モック上の操作です。')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(screen.queryByRole('dialog', { name: '家事を削除しますか？' })).not.toBeInTheDocument();
  });

  it('supports shopping reuse, local photo preview, edit delete, and unknown fallback', async () => {
    renderRoute('#/shopping/new?uilabState=reuse-picker');
    fireEvent.change(screen.getByLabelText('以前の買い物を検索'), { target: { value: '卵' } });
    fireEvent.click(screen.getByRole('button', { name: /卵/ }));
    expect(screen.getByDisplayValue('卵')).toBeVisible();
    expect(screen.getByDisplayValue('10個')).toBeVisible();

    window.location.hash = '#/shopping/new?uilabState=photo-selected';
    await waitFor(() => expect(screen.getByRole('img', { name: '選択した写真のプレビュー' })).toBeVisible());

    window.location.hash = '#/shopping/edit?uilabState=delete-confirm';
    await waitFor(() => expect(screen.getByRole('dialog', { name: '買い物を削除しますか？' })).toBeVisible());
    expect(screen.queryByText('以前の項目から選ぶ')).not.toBeInTheDocument();
    expect(screen.queryByText('モック上の操作です。')).not.toBeInTheDocument();

    window.location.hash = '#/shopping/new?uilabState=unknown';
    await waitFor(() => expect(screen.getByRole('heading', { name: '買い物を追加' })).toBeVisible());
    expect(screen.getByDisplayValue('牛乳')).toBeVisible();
  });

  it('supports optional planned date set, clear, save, and reuse reset', async () => {
    renderRoute('#/shopping/new?uilabState=normal');
    const plannedDate = screen.getByLabelText('購入予定日');
    expect(plannedDate).toHaveValue('');
    fireEvent.change(plannedDate, { target: { value: '2026-08-24' } });
    expect(plannedDate).toHaveValue('2026-08-24');
    fireEvent.change(plannedDate, { target: { value: '' } });
    expect(plannedDate).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    expect(screen.getByText('保存しました')).toBeVisible();

    fireEvent.change(plannedDate, { target: { value: '2026-08-24' } });
    fireEvent.click(screen.getByRole('button', { name: '以前の項目から選ぶ' }));
    fireEvent.click(screen.getByRole('button', { name: /牛乳/ }));
    expect(screen.getByLabelText('購入予定日')).toHaveValue('');

    window.location.hash = '#/shopping/edit?uilabState=normal';
    await waitFor(() => expect(screen.getByLabelText('購入予定日')).toHaveValue('2026-08-24'));
  });

  it('shows only the latest completed date in task edit history context', async () => {
    renderRoute('#/tasks/edit?uilabState=previous-completed');
    expect(screen.getByText('前回：8/20')).toBeVisible();

    window.location.hash = '#/tasks/edit?uilabState=previous-none';
    await waitFor(() => expect(screen.queryByText(/^前回：/)).not.toBeInTheDocument());

    window.location.hash = '#/tasks/edit?uilabState=previous-passed-only';
    await waitFor(() => expect(screen.queryByText(/^前回：/)).not.toBeInTheDocument());
  });

  it('reuses task settings but rebases absolute dates to the mock today', () => {
    renderRoute('#/tasks/new?uilabState=reuse-selected');
    expect(screen.getByDisplayValue('ゴミ出し')).toBeVisible();
    expect(screen.getByRole('button', { name: '繰り返し: 火・金' })).toBeVisible();
    expect(screen.getByLabelText('開始日')).toHaveValue('2026-08-20');
    expect(screen.getByLabelText('日付')).toHaveValue('2026-08-20');
    expect(screen.getByLabelText('終日')).not.toBeChecked();
    expect(screen.getByLabelText('時刻')).toHaveValue('08:00');
    expect(screen.getByLabelText('通知')).toHaveValue('10分前');
    expect(screen.getByRole('img', { name: '担当: ゆき' })).toBeVisible();
    expect(screen.getByDisplayValue('収集日の朝に玄関前へ出す。')).toBeVisible();
  });

  it('restores shopping photos only when the reused history item still has one', async () => {
    renderRoute('#/shopping/new?uilabState=reuse-selected');
    expect(screen.getByDisplayValue('牛乳')).toBeVisible();
    expect(screen.getByRole('img', { name: '選択した写真のプレビュー' })).toBeVisible();
    expect(screen.getByLabelText('購入予定日')).toHaveValue('');

    window.location.hash = '#/shopping/new?uilabState=reuse-no-photo-selected';
    await waitFor(() => expect(screen.getByDisplayValue('バナナ')).toBeVisible());
    expect(screen.queryByRole('img', { name: '選択した写真のプレビュー' })).not.toBeInTheDocument();
  });
});
