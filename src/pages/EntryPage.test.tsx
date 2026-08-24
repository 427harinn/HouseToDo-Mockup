import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';

function renderRoute(path: string) {
  window.location.hash = path;
  return render(<App />);
}

describe('authentication and household entry screens', () => {
  it('supports login to Home and login/register navigation without bottom navigation', async () => {
    renderRoute('#/login');

    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeVisible();
    expect(screen.getByLabelText('メールアドレス')).toBeVisible();
    expect(screen.getByLabelText('パスワード')).toBeVisible();
    expect(screen.queryByRole('navigation', { name: 'メインナビゲーション' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'アカウントを作る' }));
    await waitFor(() => expect(window.location.hash).toBe('#/register'));
    expect(screen.getByRole('heading', { name: '新規登録' })).toBeVisible();

    fireEvent.click(screen.getByRole('link', { name: 'ログイン' }));
    await waitFor(() => expect(window.location.hash).toBe('#/login'));
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    await waitFor(() => expect(window.location.hash).toBe('#/home'));
    expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible();
  });

  it('supports registration to household creation and direct invite joining', async () => {
    renderRoute('#/register');

    fireEvent.click(screen.getByRole('link', { name: '招待から参加' }));
    await waitFor(() => expect(window.location.hash).toBe('#/household/join'));
    expect(screen.getByRole('heading', { name: '招待から参加' })).toBeVisible();

    window.location.hash = '#/register';
    await waitFor(() => expect(screen.getByRole('heading', { name: '新規登録' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));
    await waitFor(() => expect(window.location.hash).toBe('#/household/create'));
    expect(screen.getByRole('heading', { name: '家庭を作る' })).toBeVisible();

    fireEvent.click(screen.getByRole('link', { name: '招待から参加' }));
    await waitFor(() => expect(window.location.hash).toBe('#/household/join'));
    expect(screen.getByLabelText('招待コード')).toBeVisible();
  });

  it('supports household create/join mutual navigation and both completion paths to Home', async () => {
    renderRoute('#/household/join');
    fireEvent.click(screen.getByRole('link', { name: '家庭を作る' }));
    await waitFor(() => expect(window.location.hash).toBe('#/household/create'));
    fireEvent.click(screen.getByRole('button', { name: '家庭を作る' }));
    await waitFor(() => expect(window.location.hash).toBe('#/home'));

    window.location.hash = '#/household/join';
    await waitFor(() => expect(screen.getByRole('heading', { name: '招待から参加' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '参加する' }));
    await waitFor(() => expect(window.location.hash).toBe('#/home'));
    expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible();
  });

  it('renders the required login, register, and invite-code error states', async () => {
    renderRoute('#/login?uilabState=error');
    expect(screen.getByRole('alert', { name: '' })).toHaveTextContent('メールアドレスまたはパスワードが正しくありません');

    window.location.hash = '#/register?uilabState=error';
    await waitFor(() => expect(screen.getByRole('heading', { name: '新規登録' })).toBeVisible());
    expect(screen.getByRole('alert')).toHaveTextContent('入力内容を確認してください');

    window.location.hash = '#/household/join?uilabState=invalid-code';
    await waitFor(() => expect(screen.getByRole('heading', { name: '招待から参加' })).toBeVisible());
    expect(screen.getByRole('alert')).toHaveTextContent('招待コードを確認してください');
    expect(screen.getByLabelText(/招待コード/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('navigation', { name: 'メインナビゲーション' })).not.toBeInTheDocument();
  });
});
