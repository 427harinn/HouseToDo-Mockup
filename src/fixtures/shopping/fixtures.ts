import type {
  ShoppingFixture,
  ShoppingItem,
  ShoppingPerson,
  ShoppingUiLabState,
} from './types';

const pantryPhoto = '/shopping-pantry.svg';

const yuki: ShoppingPerson = { id: 'yuki', name: 'ゆき', initials: 'ゆ' };
const haru: ShoppingPerson = { id: 'haru', name: 'はる', initials: 'は' };

const activeItems: ShoppingItem[] = [
  {
    id: 'shopping-milk',
    name: '牛乳',
    quantity: '1本',
    addedAt: '2026-08-18T08:10:00+09:00',
    memo: '低脂肪ではない普通の牛乳。朝食用。',
    photoSrc: pantryPhoto,
    plannedDate: '2026-08-20',
  },
  {
    id: 'shopping-bananas',
    name: 'バナナ',
    quantity: '1房',
    addedAt: '2026-08-18T12:30:00+09:00',
  },
  {
    id: 'shopping-tofu',
    name: '木綿豆腐',
    quantity: '2丁',
    addedAt: '2026-08-19T09:20:00+09:00',
    memo: '麻婆豆腐に使うので木綿を選ぶ。',
    plannedDate: '2026-08-23',
  },
  {
    id: 'shopping-detergent',
    name: '洗濯洗剤',
    quantity: '詰替え 1袋',
    addedAt: '2026-08-19T16:45:00+09:00',
    photoSrc: pantryPhoto,
  },
  {
    id: 'shopping-tomatoes',
    name: 'ミニトマト',
    quantity: '1パック',
    addedAt: '2026-08-20T07:05:00+09:00',
    memo: 'お弁当用。赤くて固めのもの。',
    photoSrc: pantryPhoto,
    plannedDate: '2026-08-24',
  },
  {
    id: 'shopping-bread',
    name: '食パン',
    quantity: '6枚切り 1袋',
    addedAt: '2026-08-20T08:40:00+09:00',
  },
];

const noQuantityItem: ShoppingItem = {
  id: 'shopping-no-quantity',
  name: 'レモン',
  addedAt: '2026-08-20T09:00:00+09:00',
  memo: '炭酸水に使う。',
};

const purchasedItems: ShoppingItem[] = [
  {
    id: 'purchased-eggs',
    name: '卵',
    quantity: '10個',
    addedAt: '2026-08-16T18:00:00+09:00',
    plannedDate: '2026-08-20',
    purchasedAt: '2026-08-20T08:32:00+09:00',
    purchaser: haru,
    memo: '朝食と作り置き用。',
  },
  {
    id: 'purchased-onion',
    name: '玉ねぎ',
    quantity: '3個',
    addedAt: '2026-08-17T10:15:00+09:00',
    purchasedAt: '2026-08-19T17:20:00+09:00',
    purchaser: yuki,
    photoSrc: pantryPhoto,
  },
];

const autoFilteredPurchasedItems: ShoppingItem[] = [
  purchasedItems[0],
  {
    ...purchasedItems[1],
    id: 'purchased-expired-onion',
    purchasedAt: '2026-08-12T17:20:00+09:00',
  },
];

const manyItems: ShoppingItem[] = Array.from({ length: 15 }, (_, index) => ({
  id: `shopping-many-${index + 1}`,
  name: ['ヨーグルト', '季節の野菜', '炭酸水', 'キッチンペーパー'][index % 4],
  quantity: ['1個', '1袋', '2本', '1ロール'][index % 4],
  addedAt: `2026-08-${String(10 + index).padStart(2, '0')}T08:00:00+09:00`,
  memo: index % 3 === 0 ? 'いつもの売り場で確認する。' : undefined,
  photoSrc: index % 5 === 0 ? pantryPhoto : undefined,
}));

const longTextItems: ShoppingItem[] = [
  {
    id: 'shopping-long-name',
    name: '家族みんなで食べられる甘さ控えめの季節のフルーツ',
    quantity: '大きめ 1パック',
    addedAt: '2026-08-18T08:00:00+09:00',
    memo: '冷蔵庫の一番上に入れられるサイズで、傷みの少ないものを選ぶ。帰宅後すぐに洗って朝食用に分けておく。',
    photoSrc: pantryPhoto,
  },
  {
    id: 'shopping-long-second',
    name: '週末の作り置きに使う葉物野菜',
    quantity: '2袋',
    addedAt: '2026-08-19T08:00:00+09:00',
  },
];

export const shoppingFixtures: Record<ShoppingUiLabState, ShoppingFixture> = {
  normal: { activeItems, purchasedItems },
  'planned-date': { activeItems: [activeItems[0], activeItems[2], activeItems[4]], purchasedItems },
  'no-planned-date': {
    activeItems: activeItems.map((item) => ({ ...item, plannedDate: undefined })),
    purchasedItems,
  },
  expanded: {
    activeItems,
    purchasedItems,
    initialExpandedId: 'shopping-milk',
  },
  'purchased-open': {
    activeItems,
    purchasedItems,
    initialPurchasedOpen: true,
  },
  photo: {
    activeItems: [activeItems[3], activeItems[4], activeItems[1]],
    purchasedItems: [],
    initialExpandedId: 'shopping-detergent',
  },
  'quantity-empty': { activeItems: [noQuantityItem, activeItems[1]], purchasedItems: [] },
  deleted: {
    activeItems: activeItems.filter((item) => item.id !== 'shopping-milk'),
    purchasedItems,
    historyItems: activeItems.filter((item) => item.id !== 'shopping-milk').concat(purchasedItems),
  },
  'purchased-auto-filtered': {
    activeItems: [activeItems[1]],
    purchasedItems: autoFilteredPurchasedItems,
    historyItems: [activeItems[1], ...autoFilteredPurchasedItems],
    initialPurchasedOpen: true,
  },
  many: { activeItems: manyItems, purchasedItems },
  'long-text': {
    activeItems: longTextItems,
    purchasedItems: [],
    initialExpandedId: 'shopping-long-name',
  },
  empty: { activeItems: [], purchasedItems: [] },
};

export function getShoppingHistoryItems(fixture: ShoppingFixture): ShoppingItem[] {
  const candidates = fixture.historyItems ?? [...fixture.activeItems, ...fixture.purchasedItems];
  return [...new Map(candidates.map((item) => [item.id, item])).values()];
}
