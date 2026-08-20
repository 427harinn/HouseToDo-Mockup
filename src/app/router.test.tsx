import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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

    expect(screen.getByRole('heading', { name: 'ホーム' })).toBeVisible();
    expect(screen.getByTestId('screen-placeholder')).toBeVisible();
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
      expect(screen.getByRole('heading', { name: title })).toBeVisible();
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
    expect(screen.getByRole('heading', { name: 'ホーム' })).toBeVisible();
  });
});
