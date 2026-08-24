import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppShell } from '../components/AppShell/AppShell';
import { App } from './App';

describe('hash routing', () => {
  beforeEach(() => vi.useRealTimers());
  it('renders the foundation route directly from the hash', () => {
    window.location.hash = '#/foundation?uilabState=normal';

    render(<App />);

    expect(screen.getByRole('heading', { name: 'M1 Foundation' })).toBeVisible();
    expect(screen.getByTestId('uilab-state')).toHaveTextContent('normal');
  });

  it('renders Home inside the shared AppShell', () => {
    window.location.hash = '#/home';

    render(<App />);

    expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible();
    expect(screen.getByText('ゴミをまとめる')).toBeVisible();
    expect(screen.queryByTestId('screen-placeholder')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ホーム' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it.each([
    ['/home', 'ホーム'],
    ['/calendar', 'カレンダー'],
    ['/shopping', '買い物'],
    ['/other', 'その他'],
  ])('can navigate to %s through bottom navigation', async (path, title) => {
    window.location.hash = '#/home';
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: title }));

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${path}`);
      expect(
        screen.getByRole('heading', {
          name: path === '/home' ? 'やること' : path === '/calendar' ? '2026年8月' : title,
        }),
      ).toBeVisible();
    });

    expect(screen.getByRole('link', { name: title })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('shares Shopping purchase and restore with the Home count', async () => {
    vi.useFakeTimers();
    window.location.hash = '#/shopping?uilabState=normal';
    render(<App />);

    const milkRow = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!milkRow) throw new Error('Expected the milk row');
    fireEvent.click(milkRow.querySelector('.shopping-item-row__main') as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: /^購入$/ }));
    act(() => vi.advanceTimersByTime(200));
    vi.useRealTimers();

    fireEvent.click(screen.getByRole('link', { name: 'ホーム' }));
    await waitFor(() => expect(screen.getByRole('link', { name: '買い物 5件' })).toBeVisible());

    fireEvent.click(screen.getByRole('link', { name: '買い物' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '買い物' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '購入済み 3件' }));
    const purchasedMilk = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!purchasedMilk) throw new Error('Expected purchased milk');
    fireEvent.click(purchasedMilk.querySelector('.shopping-item-row__main') as HTMLElement);
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    act(() => vi.advanceTimersByTime(180));
    vi.useRealTimers();

    fireEvent.click(screen.getByRole('link', { name: 'ホーム' }));
    await waitFor(() => expect(screen.getByRole('link', { name: '買い物 6件' })).toBeVisible());
  });

  it('removes a purchased Shopping item from Calendar and restores its planned date', async () => {
    vi.useFakeTimers();
    window.location.hash = '#/shopping?uilabState=normal';
    render(<App />);

    const milkRow = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!milkRow) throw new Error('Expected the milk row');
    fireEvent.click(milkRow.querySelector('.shopping-item-row__main') as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: /^購入$/ }));
    act(() => vi.advanceTimersByTime(200));
    vi.useRealTimers();

    fireEvent.click(screen.getByRole('link', { name: 'カレンダー' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: /8月20日 木曜日/ }));
    await waitFor(() => expect(screen.getByRole('dialog', { name: '8月20日 木曜日' })).toBeVisible());
    expect(screen.queryByText('買うもの')).not.toBeInTheDocument();
    expect(screen.queryByText('牛乳')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: '買い物' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '買い物' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '購入済み 3件' }));
    const purchasedMilk = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!purchasedMilk) throw new Error('Expected purchased milk');
    fireEvent.click(purchasedMilk.querySelector('.shopping-item-row__main') as HTMLElement);
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    act(() => vi.advanceTimersByTime(180));
    vi.useRealTimers();

    fireEvent.click(screen.getByRole('link', { name: 'カレンダー' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '2026年8月' })).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: /8月20日 木曜日/ }));
    await waitFor(() => expect(screen.getByRole('dialog', { name: '8月20日 木曜日' })).toBeVisible());
    expect(screen.getByRole('heading', { name: '買うもの' })).toBeVisible();
    expect(screen.getByText('牛乳')).toBeVisible();
  });

  it('opens and closes the two-choice Add action sheet without changing route', () => {
    window.location.hash = '#/home?uilabState=normal';
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '追加' }));

    expect(screen.getByRole('dialog', { name: '追加' })).toBeVisible();
    expect(screen.getByRole('button', { name: '家事' })).toBeVisible();
    expect(screen.getByRole('button', { name: '買い物' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));

    expect(screen.queryByRole('dialog', { name: '追加' })).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#/home?uilabState=normal');
    expect(screen.getByRole('heading', { name: 'やること' })).toBeVisible();
  });

  it('keeps the Add sheet open for an internal press and allows the choice to work', async () => {
    window.location.hash = '#/home?uilabState=normal';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '追加' }));
    const choice = screen.getByRole('button', { name: '家事' });
    fireEvent.pointerDown(choice, { clientX: 195, clientY: 640 });
    fireEvent.pointerMove(choice, { clientX: 195, clientY: 760 });
    fireEvent.pointerUp(choice, { clientX: 195, clientY: 760 });
    expect(screen.getByRole('dialog', { name: '追加' })).toBeVisible();

    fireEvent.click(choice);
    await waitFor(() => expect(screen.getByRole('heading', { name: '家事を追加' })).toBeVisible());
  });

  it('keeps long content in a separate scroll region from bottom navigation', () => {
    render(
      <AppShell currentPath="/home">
        <section data-testid="long-placeholder-content">
          {Array.from({ length: 80 }, (_, index) => (
            <p key={index}>プレースホルダー行 {index + 1}</p>
          ))}
        </section>
      </AppShell>,
    );

    const shell = document.querySelector('.app-shell');
    const viewport = document.querySelector('.app-shell__viewport');
    const navigation = document.querySelector('.bottom-navigation');

    expect(screen.getByTestId('long-placeholder-content')).toBeVisible();
    expect(viewport).toContainElement(screen.getByTestId('long-placeholder-content'));
    expect(viewport).not.toBe(navigation);
    expect(viewport?.parentElement).toBe(shell);
    expect(navigation?.parentElement).toBe(shell);
  });
});
