import type { StorageFixture, StorageUiLabState } from './types';

export const storageFixtures: Record<StorageUiLabState, StorageFixture> = {
  normal: { usedMb: 12, limitMb: 100 },
  'near-limit': { usedMb: 92, limitMb: 100 },
};

export const storageUiLabStates = Object.keys(storageFixtures) as StorageUiLabState[];
