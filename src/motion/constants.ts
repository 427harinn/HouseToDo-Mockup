export const MOTION_MS = {
  quick: 90,
  standard: 180,
  large: 240,
  completion: 180,
  pass: 200,
  restore: 180,
  sheet: 240,
} as const;

export const MOTION_EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const HOME_SWIPE_ACTION_WIDTH = 136;
export const SHOPPING_SWIPE_ACTION_WIDTH = 80;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

export function runWithViewTransition(update: () => void, prefersReducedMotion: boolean, direction?: 'next' | 'previous') {
  const viewTransitionDocument = document as ViewTransitionDocument;
  if (!prefersReducedMotion && typeof viewTransitionDocument.startViewTransition === 'function') {
    if (direction) document.documentElement.dataset.motionDirection = direction;
    const transition = viewTransitionDocument.startViewTransition(update) as { finished?: Promise<unknown> } | undefined;
    transition?.finished?.finally(() => {
      delete document.documentElement.dataset.motionDirection;
    });
    return;
  }
  update();
}
