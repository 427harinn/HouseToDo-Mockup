import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('hash routing', () => {
  it('renders the foundation route directly from the hash', () => {
    window.location.hash = '#/foundation?uilabState=normal';

    render(<App />);

    expect(screen.getByRole('heading', { name: 'M1 Foundation' })).toBeVisible();
    expect(screen.getByTestId('uilab-state')).toHaveTextContent('normal');
  });
});
