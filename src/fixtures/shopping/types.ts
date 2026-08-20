export const shoppingUiLabStates = [
  'normal',
  'expanded',
  'purchased-open',
  'photo',
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
  quantity: string;
  addedAt: string;
  memo?: string;
  photoSrc?: string;
  purchasedAt?: string;
  purchaser?: ShoppingPerson;
};

export type ShoppingFixture = {
  activeItems: ShoppingItem[];
  purchasedItems: ShoppingItem[];
  initialExpandedId?: string;
  initialPurchasedOpen?: boolean;
};
