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

  it('supports repeat choices and weekday-specific state', () => {
    renderRoute('#/tasks/new?uilabState=normal');
    fireEvent.click(screen.getByRole('button', { name: /繰り返し:/ }));
    for (const option of ['今回だけ', '毎日', '曜日を決める', '毎月20日', '今週のどこか', '今月のどこか']) {
      expect(screen.getByRole('button', { name: option })).toBeVisible();
    }
    fireEvent.click(screen.getByRole('button', { name: '曜日を決める' }));
    expect(screen.getByText('火・金')).toBeVisible();
    expect(screen.getByRole('button', { name: '火', pressed: true })).toBeVisible();
    expect(screen.getByRole('button', { name: '金', pressed: true })).toBeVisible();
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
    expect(screen.getByRole('button', { name: '削除' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '削除' }));
    expect(screen.getByRole('dialog', { name: '家事を削除しますか？' })).toBeVisible();
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

    window.location.hash = '#/shopping/new?uilabState=unknown';
    await waitFor(() => expect(screen.getByRole('heading', { name: '買い物を追加' })).toBeVisible());
    expect(screen.getByDisplayValue('牛乳')).toBeVisible();
  });
});
