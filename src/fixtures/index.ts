import type { UiLabState } from './types';

export const foundationFixtures: Record<UiLabState, { label: string }> = {
  normal: { label: '通常fixture' },
  alternate: { label: 'alternate fixture' },
};

export { uiLabStates } from './types';
export type { UiLabState } from './types';
