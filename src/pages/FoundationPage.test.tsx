import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FoundationPage } from './FoundationPage';

describe('FoundationPage', () => {
  it('renders without a backend or API dependency', () => {
    window.location.hash = '#/foundation?uilabState=alternate';

    render(<FoundationPage />);

    expect(screen.getByRole('heading', { name: 'M1 Foundation' })).toBeVisible();
    expect(screen.getByTestId('route-path')).toHaveTextContent('/foundation');
    expect(screen.getByTestId('uilab-state')).toHaveTextContent('alternate');
  });
});
