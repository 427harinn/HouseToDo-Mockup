import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';

function renderShopping(state?: string) {
  window.location.hash = state ? `#/shopping?uilabState=${state}` : '#/shopping';
  return render(<App />);
}

function activeList() {
  const list = document.querySelector('[data-uilab-component="Shopping.ActiveList"]');
  if (!list) throw new Error('Expected the active shopping list to exist');
  return within(list as HTMLElement);
}

describe('ShoppingPage', () => {
  it('replaces the Shopping placeholder and renders oldest-first rows', () => {
    renderShopping('normal');

    expect(screen.getByRole('heading', { name: '買い物' })).toBeVisible();
    expect(screen.queryByTestId('screen-placeholder')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible();

    const names = [...document.querySelectorAll('[data-uilab-component="Shopping.ItemRow.Name"]')]
      .map((node) => node.textContent);
    expect(names.slice(0, 3)).toEqual(['牛乳', 'バナナ', '木綿豆腐']);
  });

  it('shows only memo/photo presence indicators in collapsed rows', () => {
    renderShopping('normal');

    expect(activeList().getByText('牛乳')).toBeVisible();
    expect(activeList().getByText('1本')).toBeVisible();
    expect(screen.getAllByRole('img', { name: 'メモあり' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img', { name: '写真あり' }).length).toBeGreaterThan(0);
    expect(screen.queryByText('低脂肪ではない普通の牛乳。朝食用。')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: '牛乳の写真' })).not.toBeInTheDocument();
  });

  it('expands one active row inline and closes the previous row', () => {
    renderShopping('normal');

    const milkRow = document.querySelector('[data-uilab-id="shopping-milk"]');
    const tofuRow = document.querySelector('[data-uilab-id="shopping-tofu"]');
    if (!milkRow || !tofuRow) throw new Error('Expected shopping rows');

    fireEvent.click(milkRow.querySelector('.shopping-item-row__main') as HTMLElement);
    expect(screen.getByRole('button', { name: '購入' })).toBeVisible();
    expect(screen.getByText('低脂肪ではない普通の牛乳。朝食用。')).toBeVisible();

    fireEvent.click(tofuRow.querySelector('.shopping-item-row__main') as HTMLElement);
    expect(screen.queryByText('低脂肪ではない普通の牛乳。朝食用。')).not.toBeInTheDocument();
    expect(screen.getByText('麻婆豆腐に使うので木綿を選ぶ。')).toBeVisible();

    fireEvent.click(tofuRow.querySelector('.shopping-item-row__main') as HTMLElement);
    expect(screen.queryByText('麻婆豆腐に使うので木綿を選ぶ。')).not.toBeInTheDocument();
  });

  it('opens the expanded fixture with purchase before memo and photo', () => {
    renderShopping('expanded');

    const expanded = document.querySelector('[data-uilab-component="Shopping.ItemExpanded"]');
    if (!expanded) throw new Error('Expected an expanded shopping row');
    expect(within(expanded as HTMLElement).getByRole('button', { name: '購入' })).toBeVisible();
    expect(within(expanded as HTMLElement).getByText('低脂肪ではない普通の牛乳。朝食用。')).toBeVisible();
    expect(within(expanded as HTMLElement).getByRole('img', { name: '牛乳の写真' })).toBeVisible();
    expect(expanded.textContent?.indexOf('購入')).toBeLessThan(
      expanded.textContent?.indexOf('低脂肪ではない普通の牛乳。朝食用。') ?? 0,
    );
  });

  it('moves a purchased item to the purchased section and updates the count', () => {
    renderShopping('expanded');

    fireEvent.click(screen.getByRole('button', { name: '購入' }));

    const list = document.querySelector('[data-uilab-component="Shopping.ActiveList"]');
    if (!list) throw new Error('Expected the active shopping list');
    expect(within(list as HTMLElement).queryByText('牛乳')).not.toBeInTheDocument();
    expect(screen.getByText('購入済み 3件')).toBeVisible();
    const purchasedSection = document.querySelector('[data-uilab-component="Shopping.PurchasedSection"]');
    if (!purchasedSection) throw new Error('Expected the purchased section');
    expect(within(purchasedSection as HTMLElement).queryByText('牛乳')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '購入' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '戻す' })).not.toBeInTheDocument();
  });

  it('preserves an already-open purchased section when purchasing an item', () => {
    renderShopping('purchased-open');

    const milkRow = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!milkRow) throw new Error('Expected the milk row');
    fireEvent.click(milkRow.querySelector('.shopping-item-row__main') as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: '購入' }));

    expect(screen.getByText('購入済み 3件')).toBeVisible();
    expect(screen.getByText('牛乳')).toBeVisible();
  });

  it('keeps purchased collapsed by default and supports purchased-open', () => {
    const { unmount } = renderShopping('normal');

    expect(screen.getByText('購入済み 2件')).toBeVisible();
    expect(screen.queryByText('卵')).not.toBeInTheDocument();

    unmount();
    renderShopping('purchased-open');
    expect(screen.getByText('卵')).toBeVisible();
    expect(screen.getByText('今日 8:32')).toBeVisible();
    expect(screen.getByRole('img', { name: '購入者: はる' })).toBeVisible();
  });

  it('expands a purchased row with restore and returns it to active', () => {
    renderShopping('purchased-open');

    const eggsRow = document.querySelector('[data-uilab-id="purchased-eggs"]');
    if (!eggsRow) throw new Error('Expected purchased eggs row');
    fireEvent.click(eggsRow.querySelector('.shopping-item-row__main') as HTMLElement);
    expect(screen.getByRole('button', { name: '戻す' })).toBeVisible();
    expect(screen.getByText('朝食と作り置き用。')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '戻す' }));
    expect(screen.getByText('卵')).toBeVisible();
    expect(screen.getByText('購入済み 1件')).toBeVisible();
    expect(screen.getByRole('button', { name: /卵.*10個/ })).toBeVisible();
  });

  it('uses the actual pointer swipe path to reveal 編集 only', () => {
    renderShopping('normal');
    const row = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!row) throw new Error('Expected the milk row');

    fireEvent(row, new MouseEvent('pointerdown', { bubbles: true, clientX: 300, clientY: 120 }));
    fireEvent(row, new MouseEvent('pointerup', { bubbles: true, clientX: 220, clientY: 120 }));

    expect(screen.getByRole('button', { name: '編集' })).toBeVisible();
    expect(row).toHaveClass('is-actions-open');
    const swipeMore = row.querySelector('.shopping-item-row__more');
    if (!swipeMore) throw new Error('Expected the hidden edit fallback button');
    expect(swipeMore).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(swipeMore).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button', { name: '削除' })).not.toBeInTheDocument();
  });

  it('provides a focus-only keyboard/mouse fallback for 編集', () => {
    renderShopping('normal');
    const row = document.querySelector('[data-uilab-id="shopping-milk"]');
    if (!row) throw new Error('Expected the milk row');

    const more = within(row as HTMLElement).getByRole('button', { name: '牛乳の操作' });
    expect(more).toHaveAttribute('aria-expanded', 'false');
    more.focus();
    fireEvent.keyDown(more, { key: 'Enter', code: 'Enter' });
    fireEvent.click(more);

    expect(more).toHaveAttribute('aria-expanded', 'true');
    expect(row).toHaveClass('is-actions-open');
    expect(more).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: '編集' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '削除' })).not.toBeInTheDocument();
  });

  it('changes visible priority order with the keyboard/mouse reorder fallback', () => {
    renderShopping('normal');
    const list = activeList();
    expect(list.getAllByRole('button', { name: /を上へ|を下へ/ }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'バナナを上へ' }));
    const names = [...document.querySelectorAll('[data-uilab-component="Shopping.ItemRow.Name"]')]
      .map((node) => node.textContent);
    expect(names.slice(0, 2)).toEqual(['バナナ', '牛乳']);
  });

  it('supports the intended long-press and pointer-drag reorder path', () => {
    vi.useFakeTimers();
    try {
      renderShopping('normal');
      const milkRow = document.querySelector('[data-uilab-id="shopping-milk"]');
      const bananaRow = document.querySelector('[data-uilab-id="shopping-bananas"]');
      if (!milkRow || !bananaRow) throw new Error('Expected draggable shopping rows');

      fireEvent(milkRow, new MouseEvent('pointerdown', { bubbles: true, clientX: 180, clientY: 100 }));
      act(() => {
        vi.advanceTimersByTime(360);
      });
      act(() => {
        fireEvent(bananaRow, new MouseEvent('pointermove', { bubbles: true, clientX: 180, clientY: 2 }));
        fireEvent(milkRow, new MouseEvent('pointerup', { bubbles: true, clientX: 180, clientY: 2 }));
      });

      const names = [...document.querySelectorAll('[data-uilab-component="Shopping.ItemRow.Name"]')]
        .map((node) => node.textContent);
      expect(names.slice(0, 2)).toEqual(['バナナ', '牛乳']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows the local photo only in expanded photo state', () => {
    renderShopping('photo');

    expect(screen.getByRole('img', { name: '洗濯洗剤の写真' })).toBeVisible();
    expect(screen.getAllByRole('img', { name: '写真あり' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: '購入' })).toBeVisible();
  });

  it('supports many, long-text, empty, and unknown-state fallback fixtures', () => {
    let rendered = renderShopping('many');
    expect(screen.getAllByRole('button', { name: /を上へ|を下へ/ }).length).toBeGreaterThan(10);
    expect(document.querySelector('.app-shell__viewport')).not.toContainElement(
      screen.getByRole('navigation', { name: 'メインナビゲーション' }),
    );

    rendered.unmount();
    rendered = renderShopping('long-text');
    expect(screen.getByText('家族みんなで食べられる甘さ控えめの季節のフルーツ')).toBeVisible();
    expect(screen.getByText(/冷蔵庫の一番上に入れられるサイズ/)).toBeVisible();

    rendered.unmount();
    rendered = renderShopping('empty');
    expect(screen.getByText('買うものはありません')).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible();

    rendered.unmount();
    renderShopping('unknown');
    expect(screen.getByText('牛乳')).toBeVisible();
  });
});
