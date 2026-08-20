import { describe, expect, it } from 'vitest';
import { DEFAULT_UI_LAB_STATE, getUiLabState } from './state';

describe('getUiLabState', () => {
  it('returns the requested state from a hash URL', () => {
    expect(getUiLabState('#/foundation?uilabState=alternate')).toBe('alternate');
  });

  it('falls back to the default for missing or unknown states', () => {
    expect(getUiLabState('#/foundation')).toBe(DEFAULT_UI_LAB_STATE);
    expect(getUiLabState('#/foundation?uilabState=unknown')).toBe(
      DEFAULT_UI_LAB_STATE,
    );
  });
});
