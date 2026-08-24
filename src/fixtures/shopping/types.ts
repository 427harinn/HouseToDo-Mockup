export const shoppingUiLabStates = [
  'normal',
  'planned-date',
  'no-planned-date',
  'expanded',
  'purchased-open',
  'photo',
  'quantity-empty',
  'deleted',
  'purchased-auto-filtered',
  'many',
  'long-text',
  'empty',
] as const;

export type ShoppingUiLabState = (typeof shoppingUiLabStates)[number];

export type ShoppingPerson = {
  id: string;
  name: string;
  initials: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity?: string;
  addedAt: string;
  memo?: string;
  photoSrc?: string;
  plannedDate?: string;
  purchasedAt?: string;
  purchaser?: ShoppingPerson;
};

export type ShoppingFixture = {
  activeItems: ShoppingItem[];
  purchasedItems: ShoppingItem[];
  historyItems?: ShoppingItem[];
  initialExpandedId?: string;
  initialPurchasedOpen?: boolean;
};
