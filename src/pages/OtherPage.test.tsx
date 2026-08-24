import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';

function renderRoute(path: string) {
  window.location.hash = path;
  return render(<App />);
}

describe('M7 Other / Settings', () => {
  it('renders the five-row Other landing and navigates to each detail route', async () => {
    renderRoute('#/other');

    expect(screen.getByRole('heading', { name: 'その他' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'その他の設定' })).toBeVisible();
    expect(within(screen.getByRole('navigation', { name: 'その他の設定' })).getAllByRole('link')).toHaveLength(5);
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible();

    const routes = [
      ['メンバー', '#/other/members', 'メンバー'],
      ['通知', '#/other/notifications', '通知'],
      ['ストレージ', '#/other/storage', 'ストレージ'],
      ['家庭設定', '#/other/household', '家庭設定'],
      ['アカウント', '#/other/account', 'アカウント'],
    ] as const;

    for (const [label, hash, heading] of routes) {
      window.location.hash = '#/other';
      await waitFor(() => expect(screen.getByRole('heading', { name: 'その他' })).toBeVisible());
      fireEvent.click(screen.getByRole('link', { name: label }));
      await waitFor(() => expect(window.location.hash).toBe(hash));
      expect(screen.getByRole('heading', { name: heading })).toBeVisible();
      expect(screen.queryByRole('navigation', { name: 'メインナビゲーション' })).not.toBeInTheDocument();
    }
  });

  it('shows deterministic members and supports invite sheet open, copy feedback, and close', () => {
    renderRoute('#/other/members?uilabState=normal');

    expect(screen.getByRole('img', { name: 'アバター: ゆき' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'アバター: はる' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '招待する' }));
    expect(screen.getByRole('dialog', { name: 'メンバーを招待' })).toBeVisible();
    expect(screen.getByText('HOUSE-4821')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));
    expect(screen.getByRole('status')).toHaveTextContent('コードをコピーしました');
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(screen.queryByRole('dialog', { name: 'メンバーを招待' })).not.toBeInTheDocument();
  });

  it('opens invite sheet from the deterministic state', () => {
    renderRoute('#/other/members?uilabState=invite-open');
    expect(screen.getByRole('dialog', { name: 'メンバーを招待' })).toBeVisible();
  });

  it('conditionally renders notification times when toggles are enabled', () => {
    renderRoute('#/other/notifications?uilabState=normal');
    expect(screen.getByLabelText('朝のまとめ通知')).toBeChecked();
    expect(screen.getByLabelText('夜のまとめ通知')).toBeChecked();
    expect(screen.getByLabelText('朝のまとめ通知の時刻')).toHaveValue('09:00');
    expect(screen.getByLabelText('夜のまとめ通知の時刻')).toHaveValue('21:00');

    fireEvent.click(screen.getByLabelText('朝のまとめ通知'));
    expect(screen.queryByLabelText('朝のまとめ通知の時刻')).not.toBeInTheDocument();
    expect(screen.getByLabelText('夜のまとめ通知の時刻')).toBeVisible();
    fireEvent.change(screen.getByLabelText('夜のまとめ通知の時刻'), { target: { value: '22:30' } });
    expect(screen.getByLabelText('夜のまとめ通知の時刻')).toHaveValue('22:30');

    fireEvent.click(screen.getByLabelText('夜のまとめ通知'));
    expect(screen.queryByLabelText('夜のまとめ通知の時刻')).not.toBeInTheDocument();
  });

  it('disables schedules when device notifications are off without changing their values', () => {
    renderRoute('#/other/notifications?uilabState=device-off');
    const deviceToggle = screen.getByLabelText('この端末の通知');
    const morningToggle = screen.getByLabelText('朝のまとめ通知');
    const eveningToggle = screen.getByLabelText('夜のまとめ通知');

    expect(deviceToggle).not.toBeChecked();
    expect(morningToggle).toBeChecked();
    expect(eveningToggle).toBeChecked();
    expect(morningToggle).toBeDisabled();
    expect(eveningToggle).toBeDisabled();
    expect(screen.getByLabelText('朝のまとめ通知の時刻')).toBeDisabled();
    expect(screen.getByLabelText('夜のまとめ通知の時刻')).toBeDisabled();

    fireEvent.click(deviceToggle);
    expect(deviceToggle).toBeChecked();
    expect(morningToggle).toBeChecked();
    expect(eveningToggle).toBeChecked();
    expect(morningToggle).toBeEnabled();
    expect(eveningToggle).toBeEnabled();
  });

  it('supports all-schedule-off and unknown notification states', async () => {
    renderRoute('#/other/notifications?uilabState=all-schedule-off');
    expect(screen.getByLabelText('この端末の通知')).toBeChecked();
    expect(screen.getByLabelText('朝のまとめ通知')).not.toBeChecked();
    expect(screen.getByLabelText('夜のまとめ通知')).not.toBeChecked();
    expect(screen.queryByLabelText('朝のまとめ通知の時刻')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('夜のまとめ通知の時刻')).not.toBeInTheDocument();

    window.location.hash = '#/other/notifications?uilabState=unknown';
    await waitFor(() => expect(screen.getByLabelText('朝のまとめ通知')).toBeChecked());
    expect(screen.getByLabelText('この端末の通知')).toBeChecked();
    expect(screen.getByLabelText('夜のまとめ通知')).toBeChecked();
  });

  it('shows storage usage and keeps the near-limit bar within 100 percent', async () => {
    renderRoute('#/other/storage?uilabState=normal');
    expect(screen.getByRole('heading', { name: 'ストレージ' })).toBeVisible();
    expect(screen.getByText('12 MB / 100 MB')).toBeVisible();
    expect(screen.getByText('12%')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'ストレージ使用量' })).toHaveAttribute('aria-valuenow', '12');

    window.location.hash = '#/other/storage?uilabState=near-limit';
    await waitFor(() => expect(screen.getByText('92 MB / 100 MB')).toBeVisible());
    expect(screen.getByText('92%')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'ストレージ使用量' })).toHaveAttribute('aria-valuenow', '92');
  });

  it('supports household editing, timezone selection, and local save feedback', () => {
    renderRoute('#/other/household?uilabState=timezone-open');
    expect(screen.getByRole('dialog', { name: 'タイムゾーン' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'America/Los_Angeles' }));
    expect(screen.getByRole('button', { name: 'タイムゾーン: America/Los_Angeles' })).toBeVisible();
    fireEvent.change(screen.getByLabelText('家庭名'), { target: { value: '長い家庭名のテスト' } });
    expect(screen.getByLabelText('家庭名')).toHaveValue('長い家庭名のテスト');
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    expect(screen.getByRole('status')).toHaveTextContent('保存しました');
  });

  it('supports account avatar actions and logout confirmation flow', () => {
    const { unmount } = renderRoute('#/other/account?uilabState=normal');
    expect(screen.getByDisplayValue('はる')).toBeVisible();
    expect(screen.getByDisplayValue('haru@example.com')).toHaveAttribute('readonly');
    expect(screen.getByRole('img', { name: 'アバター: はる' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'プロフィール画像を変更' }));
    expect(screen.getByRole('dialog', { name: 'プロフィール画像' })).toBeVisible();
    expect(screen.getByRole('button', { name: '写真を選択' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));

    fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }));
    expect(screen.getByRole('dialog', { name: 'ログアウトしますか？' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(screen.queryByRole('dialog', { name: 'ログアウトしますか？' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }));
    fireEvent.click(screen.getByRole('dialog', { name: 'ログアウトしますか？' }).querySelector('.settings-danger-action')!);
    expect(screen.getByRole('status')).toHaveTextContent('ログアウトしました');

    unmount();
    renderRoute('#/other/account?uilabState=photo-selected');
    expect(screen.getByRole('img', { name: 'プロフィール画像' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'プロフィール画像を変更' }));
    expect(screen.getByRole('button', { name: '初期状態に戻す' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '初期状態に戻す' }));
    expect(screen.getByRole('img', { name: 'アバター: はる' })).toBeVisible();
    expect(screen.queryByRole('img', { name: 'プロフィール画像' })).not.toBeInTheDocument();
  });

  it('opens logout confirmation from the deterministic state and falls back unknown states', async () => {
    renderRoute('#/other/account?uilabState=logout-confirm');
    expect(screen.getByRole('dialog', { name: 'ログアウトしますか？' })).toBeVisible();

    window.location.hash = '#/other/account?uilabState=unknown';
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'ログアウトしますか？' })).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'アカウント' })).toBeVisible();
  });
});
