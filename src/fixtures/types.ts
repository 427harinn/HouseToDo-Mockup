export const uiLabStates = ['normal', 'alternate'] as const;

export type UiLabState = (typeof uiLabStates)[number];
