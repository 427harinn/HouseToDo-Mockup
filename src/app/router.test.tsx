import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from '../components/AppShell/AppShell';
import { App } from './App';

describe('hash routing', () => {
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
