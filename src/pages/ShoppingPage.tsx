import {
  ChevronRight,
  Ellipsis,
  Image as ImageIcon,
  MessageCircle,
  ShoppingCart,
  Undo2,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import {
  getShoppingHistoryItems,
  shoppingFixtures,
  type ShoppingFixture,
  type ShoppingItem,
  type ShoppingUiLabState,
} from '../fixtures/shopping';
import { getShoppingUiLabState } from '../mock/shoppingState';
import { MOCK_NOW, MOCK_TODAY } from '../mock/constants';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { MOTION_MS, SHOPPING_SWIPE_ACTION_WIDTH } from '../motion/constants';

const PURCHASED_VISIBLE_DAYS = 7;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

type ShoppingPageProps = {
  state?: ShoppingUiLabState;
  initialItemId?: string | null;
  fixtureOverride?: ShoppingFixture;
  onSessionChange?: (fixture: ShoppingFixture) => void;
};

export function ShoppingPage({ state = getShoppingUiLabState(), initialItemId = null, fixtureOverride, onSessionChange }: ShoppingPageProps) {
  const fixture = fixtureOverride ?? shoppingFixtures[state];
  const [activeItems, setActiveItems] = useState<ShoppingItem[]>(fixture.activeItems);
  const [purchasedItems, setPurchasedItems] = useState<ShoppingItem[]>(
    fixture.purchasedItems,
  );
  const visiblePurchasedItems = getVisiblePurchasedItems(purchasedItems);
  const [expandedId, setExpandedId] = useState<string | null>(
    initialItemId ?? fixture.initialExpandedId ?? null,
  );
  const [purchasedOpen, setPurchasedOpen] = useState(
    fixture.initialPurchasedOpen ?? false,
  );
  const [actionsOpenId, setActionsOpenId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [removingItemIds, setRemovingItemIds] = useState<Set<string>>(() => new Set());
  const [restoringItemIds, setRestoringItemIds] = useState<Set<string>>(() => new Set());
  const [statusMessage, setStatusMessage] = useState('');
  const transitionTimers = useRef<number[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => () => transitionTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    setActiveItems(fixture.activeItems);
    setPurchasedItems(fixture.purchasedItems);
    setExpandedId(initialItemId ?? fixture.initialExpandedId ?? null);
    setPurchasedOpen(fixture.initialPurchasedOpen ?? false);
    setActionsOpenId(null);
    setDraggingId(null);
    setDragOverId(null);
    setRemovingItemIds(new Set());
    setRestoringItemIds(new Set());
  }, [fixture, initialItemId, state]);

  const persistState = (nextActiveItems: ShoppingItem[], nextPurchasedItems: ShoppingItem[], nextHistoryItems?: ShoppingItem[]) => {
    setActiveItems(nextActiveItems);
    setPurchasedItems(nextPurchasedItems);
    onSessionChange?.({
      ...fixture,
      activeItems: nextActiveItems,
      purchasedItems: nextPurchasedItems,
      historyItems: nextHistoryItems ?? fixture.historyItems,
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedId((current) => (current === itemId ? null : itemId));
    setActionsOpenId(null);
  };

  const purchaseItem = (item: ShoppingItem) => {
    if (removingItemIds.has(item.id) || restoringItemIds.has(item.id)) return;
    const nextActiveItems = activeItems.filter((activeItem) => activeItem.id !== item.id);
    const nextPurchasedItems = [
      ...purchasedItems,
      { ...item, purchasedAt: `${MOCK_TODAY}T17:42:00+09:00`, purchaser: item.purchaser ?? { id: 'yuki', name: 'ゆき', initials: 'ゆ' } },
    ];
    const nextHistoryItems = [...getShoppingHistoryItems(fixture), item].filter((candidate, index, items) => items.findIndex((entry) => entry.id === candidate.id) === index);
    setRemovingItemIds((current) => new Set(current).add(item.id));
    setActionsOpenId(null);
    const timer = window.setTimeout(() => {
      setExpandedId(null);
      persistState(nextActiveItems, nextPurchasedItems, nextHistoryItems);
      setRemovingItemIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }, prefersReducedMotion ? 0 : MOTION_MS.standard);
    transitionTimers.current.push(timer);
    setStatusMessage(`「${item.name}」を購入済みに移しました`);
  };

  const restoreItem = (item: ShoppingItem) => {
    if (removingItemIds.has(item.id) || restoringItemIds.has(item.id)) return;
    const restored: ShoppingItem = { ...item };
    delete restored.purchasedAt;
    delete restored.purchaser;
    const nextPurchasedItems = purchasedItems.filter((purchasedItem) => purchasedItem.id !== item.id);
    const nextActiveItems = [...activeItems, restored].sort((left, right) => left.addedAt.localeCompare(right.addedAt));
    setRestoringItemIds((current) => new Set(current).add(item.id));
    setExpandedId(null);
    const timer = window.setTimeout(() => {
      persistState(nextActiveItems, nextPurchasedItems, fixture.historyItems);
      setRestoringItemIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }, prefersReducedMotion ? 0 : MOTION_MS.restore);
    transitionTimers.current.push(timer);
    setStatusMessage(`「${item.name}」を未購入に戻しました`);
  };

  const reorderAround = (overId: string, clientY: number, rowTop: number, rowHeight: number) => {
    if (!draggingId || draggingId === overId) return;
    const placeAfter = clientY >= rowTop + rowHeight / 2;
    setActiveItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggingId);
      const overIndex = current.findIndex((item) => item.id === overId);
      if (fromIndex < 0 || overIndex < 0 || fromIndex === overIndex) return current;
      if ((fromIndex < overIndex && !placeAfter) || (fromIndex > overIndex && placeAfter)) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      const insertIndex = fromIndex < overIndex ? overIndex : overIndex;
      next.splice(insertIndex, 0, moved);
      return next;
    });
    setDragOverId(overId);
  };

  const finishReorder = () => {
    if (draggingId) setStatusMessage('並び順を更新しました');
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="screen-content shopping-page" data-uilab-component="Shopping.Page" data-uilab-id="shopping-page">
      <header className="shopping-header" data-uilab-component="Shopping.Header" data-uilab-id="shopping-header">
        <h1>買い物</h1>
      </header>

      {activeItems.length > 0 ? (
        <section
          className="shopping-active-list"
          aria-label="未購入の買い物一覧"
          data-uilab-component="Shopping.ActiveList"
          data-uilab-id="shopping-active-list"
        >
          {activeItems.map((item) => (
            <ShoppingItemRow
              key={item.id}
          item={item}
              expanded={expandedId === item.id}
              leaving={removingItemIds.has(item.id)}
              entering={restoringItemIds.has(item.id)}
              actionsOpen={actionsOpenId === item.id}
              dragging={draggingId === item.id}
              dragSessionActive={draggingId !== null}
              dragOver={dragOverId === item.id}
              onToggle={() => toggleExpanded(item.id)}
              onPurchase={() => purchaseItem(item)}
              onRestore={() => restoreItem(item)}
              onEdit={() => { window.location.hash = `#/shopping/edit?item=${encodeURIComponent(item.id)}&shoppingState=${encodeURIComponent(state)}`; }}
              onSwipeOpen={() => {
                setActionsOpenId(item.id);
                setExpandedId(null);
              }}
              onDismissActions={() => setActionsOpenId(null)}
              onDragStart={() => {
                setActionsOpenId(null);
                setExpandedId(null);
                setDraggingId(item.id);
              }}
              onDragOver={reorderAround}
              onDragEnd={finishReorder}
              canMoveUp={activeItems.findIndex((activeItem) => activeItem.id === item.id) > 0}
              canMoveDown={
                activeItems.findIndex((activeItem) => activeItem.id === item.id) <
                activeItems.length - 1
              }
              onMove={(direction) => {
                setActiveItems((current) => {
                  const index = current.findIndex((activeItem) => activeItem.id === item.id);
                  const target = direction === 'up' ? index - 1 : index + 1;
                  if (index < 0 || target < 0 || target >= current.length) return current;
                  const next = [...current];
                  [next[index], next[target]] = [next[target], next[index]];
                  return next;
                });
                setStatusMessage('並び順を更新しました');
              }}
            />
          ))}
        </section>
      ) : (
        <section className="shopping-empty-state" aria-label="買うものなし" data-uilab-component="Shopping.EmptyState" data-uilab-id="shopping-empty-state">
          <div className="shopping-empty-state__illustration" aria-hidden="true">
            <ShoppingCart />
            <span>✓</span>
          </div>
          <p>買うものはありません</p>
        </section>
      )}

      <section className="shopping-purchased" data-uilab-component="Shopping.PurchasedSection" data-uilab-id="shopping-purchased-section">
        <div className="shopping-purchased__header">
          <button
            type="button"
            className="shopping-purchased__toggle"
            aria-expanded={purchasedOpen}
            onClick={() => setPurchasedOpen((open) => !open)}
          >
            <span>購入済み {visiblePurchasedItems.length}件</span>
            <ChevronRight aria-hidden="true" className={purchasedOpen ? 'is-open' : ''} />
          </button>
        </div>
        {purchasedOpen && visiblePurchasedItems.length > 0 ? (
          <div className="shopping-purchased__list">
            {visiblePurchasedItems.map((item) => (
              <ShoppingItemRow
                key={item.id}
                item={item}
                purchased
                expanded={expandedId === item.id}
                leaving={false}
                entering={false}
                actionsOpen={false}
                dragging={false}
                dragSessionActive={false}
                dragOver={false}
                onToggle={() => toggleExpanded(item.id)}
                onPurchase={() => purchaseItem(item)}
                onRestore={() => restoreItem(item)}
                onEdit={() => undefined}
                onSwipeOpen={() => undefined}
                onDismissActions={() => undefined}
                onDragStart={() => undefined}
                onDragOver={() => undefined}
                onDragEnd={() => undefined}
                canMoveUp={false}
                canMoveDown={false}
                onMove={() => undefined}
              />
            ))}
          </div>
        ) : null}
      </section>

      <p className="shopping-status" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

function getVisiblePurchasedItems(items: ShoppingItem[]) {
  const now = Date.parse(MOCK_NOW);
  const visibleUntil = PURCHASED_VISIBLE_DAYS * DAY_IN_MILLISECONDS;
  return items.filter((item) => {
    if (!item.purchasedAt) return false;
    const purchasedAt = Date.parse(item.purchasedAt);
    const age = now - purchasedAt;
    return age >= 0 && age < visibleUntil;
  });
}

function formatPurchasedAt(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  const date = `${year}-${month}-${day}`;
  const previousDate = new Date(MOCK_NOW);
  previousDate.setDate(previousDate.getDate() - 1);
  const yesterday = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${String(previousDate.getDate()).padStart(2, '0')}`;
  const label = date === MOCK_TODAY
    ? '今日'
    : date === yesterday
      ? '昨日'
      : `${Number(month)}/${Number(day)}`;
  return `${label} ${Number(hour)}:${minute}`;
}

type ShoppingItemRowProps = {
  item: ShoppingItem;
  purchased?: boolean;
  leaving: boolean;
  entering: boolean;
  expanded: boolean;
  actionsOpen: boolean;
  dragging: boolean;
  dragSessionActive: boolean;
  dragOver: boolean;
  onToggle: () => void;
  onPurchase: () => void;
  onRestore: () => void;
  onEdit: () => void;
  onSwipeOpen: () => void;
  onDismissActions: () => void;
  onDragStart: () => void;
  onDragOver: (id: string, clientY: number, rowTop: number, rowHeight: number) => void;
  onDragEnd: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: 'up' | 'down') => void;
};

function ShoppingItemRow({
  item,
  purchased = false,
  leaving,
  entering,
  expanded,
  actionsOpen,
  dragging,
  dragSessionActive,
  dragOver,
  onToggle,
  onPurchase,
  onRestore,
  onEdit,
  onSwipeOpen,
  onDismissActions,
  onDragStart,
  onDragOver,
  onDragEnd,
  canMoveUp,
  canMoveDown,
  onMove,
}: ShoppingItemRowProps) {
  const gestureStart = useRef<{ x: number; y: number } | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const dragStarted = useRef(false);
  const rowRef = useRef<HTMLElement | null>(null);
  const swipeStartOffset = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(actionsOpen ? -SHOPPING_SWIPE_ACTION_WIDTH : 0);
  const [isSwiping, setIsSwiping] = useState(false);

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    gestureStart.current = { x: event.clientX, y: event.clientY };
    setIsSwiping(false);
    swipeStartOffset.current = actionsOpen ? -SHOPPING_SWIPE_ACTION_WIDTH : 0;
    setSwipeOffset(swipeStartOffset.current);
    dragStarted.current = false;
    clearLongPress();
    if (!purchased) {
      longPressTimer.current = window.setTimeout(() => {
        dragStarted.current = true;
        onDragStart();
      }, 360);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!purchased && dragSessionActive && !dragging && rowRef.current) {
      const bounds = rowRef.current.getBoundingClientRect();
      onDragOver(item.id, event.clientY, bounds.top, bounds.height);
      return;
    }
    const start = gestureStart.current;
    if (!start) return;
    const distanceX = Math.abs(start.x - event.clientX);
    const distanceY = Math.abs(start.y - event.clientY);
    const deltaX = event.clientX - start.x;
    if (distanceX > distanceY && !dragStarted.current && !purchased) {
      setIsSwiping(true);
      setSwipeOffset(Math.max(-SHOPPING_SWIPE_ACTION_WIDTH, Math.min(0, swipeStartOffset.current + deltaX)));
    }
    if (!dragStarted.current && (distanceX > 12 || distanceY > 12)) clearLongPress();
    if (dragStarted.current && rowRef.current) {
      const bounds = rowRef.current.getBoundingClientRect();
      onDragOver(item.id, event.clientY, bounds.top, bounds.height);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    clearLongPress();
    const start = gestureStart.current;
    gestureStart.current = null;
    setIsSwiping(false);
    if (!start) {
      if (!purchased && dragSessionActive && !dragging) onDragEnd();
      return;
    }
    if (dragStarted.current) {
      dragStarted.current = false;
      suppressClick.current = true;
      onDragEnd();
      return;
    }
    if (!purchased && start.x - event.clientX > 48) {
      suppressClick.current = true;
      setSwipeOffset(-SHOPPING_SWIPE_ACTION_WIDTH);
      onSwipeOpen();
    } else if (!purchased && event.clientX - start.x > 24 && actionsOpen) {
      suppressClick.current = true;
      setSwipeOffset(0);
      onDismissActions();
    } else {
      setSwipeOffset(actionsOpen ? -SHOPPING_SWIPE_ACTION_WIDTH : 0);
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (!suppressClick.current) return;
    if (
      event.target instanceof Element &&
      (event.target.closest('.shopping-item-row__actions') ||
        event.target.closest('.shopping-item-row__actions-dismiss') ||
        event.target.closest('.shopping-reorder-fallback') ||
        event.target.closest('.shopping-item-row__more'))
    ) {
      suppressClick.current = false;
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  };

  return (
    <article
      ref={rowRef}
      className={`shopping-item-row${expanded ? ' is-expanded' : ''}${actionsOpen ? ' is-actions-open' : ''}${dragging ? ' is-dragging' : ''}${dragOver ? ' is-drag-over' : ''}${isSwiping ? ' is-swipe-dragging' : ''}${leaving ? ' is-leaving' : ''}${entering ? ' is-entering' : ''}`}
      data-uilab-component={purchased ? 'Shopping.PurchasedRow' : 'Shopping.ItemRow'}
      data-uilab-id={item.id}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        clearLongPress();
        gestureStart.current = null;
        if (dragStarted.current) onDragEnd();
        dragStarted.current = false;
        setIsSwiping(false);
      }}
      onClickCapture={handleClickCapture}
    >
      <div className="shopping-item-row__content" style={{ '--swipe-offset': `${swipeOffset}px` } as CSSProperties}>
        <button
          type="button"
          className="shopping-item-row__main"
          aria-expanded={expanded}
          onClick={onToggle}
        >
          {purchased ? (
            <span className="shopping-item-row__purchased-details">
          <span className="shopping-item-row__name" data-uilab-component="Shopping.ItemRow.Name" data-uilab-id={`shopping-item-${item.id}-name`}>
            {item.name}
          </span>
              <span className="shopping-item-row__meta">
                {item.purchasedAt ? formatPurchasedAt(item.purchasedAt) : '購入済み'}
              </span>
            </span>
          ) : (
            <span className="shopping-item-row__details">
              <span className="shopping-item-row__name" data-uilab-component="Shopping.ItemRow.Name" data-uilab-id={`shopping-item-${item.id}-name`}>
                {item.name}
              </span>
              {item.plannedDate ? (
                <span className="shopping-item-row__planned-date" data-uilab-component="Shopping.ItemRow.PlannedDate" data-uilab-id={`shopping-item-${item.id}-planned-date`}>
                  {formatPlannedDate(item.plannedDate)}予定
                </span>
              ) : null}
            </span>
          )}
          {!purchased && item.memo ? (
            <span className="shopping-item-row__indicator" role="img" aria-label="メモあり">
              <MessageCircle aria-hidden="true" />
            </span>
          ) : null}
          {!purchased && item.photoSrc ? (
            <span className="shopping-item-row__indicator" role="img" aria-label="写真あり">
              <ImageIcon aria-hidden="true" />
            </span>
          ) : null}
          {item.quantity ? (
            <span
              className="shopping-item-row__quantity"
              data-uilab-component="Shopping.ItemRow.Quantity"
              data-uilab-id={`shopping-item-${item.id}-quantity`}
            >
              {item.quantity}
            </span>
          ) : null}
          {purchased && item.purchaser ? <Avatar person={item.purchaser} /> : null}
        </button>
        {!purchased ? (
          <button
            type="button"
            className="shopping-item-row__more"
            aria-label={`${item.name}の操作`}
            aria-expanded={actionsOpen}
            aria-hidden={actionsOpen}
            tabIndex={actionsOpen ? -1 : 0}
            data-uilab-component="Shopping.ItemRow.MoreButton"
            data-uilab-id={`shopping-item-${item.id}-more`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.currentTarget.blur();
              if (actionsOpen) {
                setSwipeOffset(0);
                onDismissActions();
              } else {
                setSwipeOffset(-SHOPPING_SWIPE_ACTION_WIDTH);
                onSwipeOpen();
              }
            }}
          >
            <Ellipsis aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {!purchased && actionsOpen ? (
        <div className="shopping-item-row__actions" aria-label={`${item.name}の操作メニュー`}>
          <button type="button" onClick={onEdit}>
            編集
          </button>
        </div>
      ) : null}

      {expanded ? (
        <div className="shopping-item-row__expanded" data-uilab-component="Shopping.ItemExpanded" data-uilab-id={`shopping-item-${item.id}-expanded`}>
          <button
            type="button"
            className="shopping-item-row__primary-action motion-pressable"
            onClick={purchased ? onRestore : onPurchase}
            data-uilab-component={purchased ? 'Shopping.PurchasedRestoreButton' : 'Shopping.ItemPurchaseButton'}
            data-uilab-id={`shopping-item-${item.id}-primary-action`}
          >
            {purchased ? <Undo2 aria-hidden="true" /> : null}
            {purchased ? '戻す' : '購入'}
          </button>
          {item.memo ? (
            <div className="shopping-item-row__memo" data-uilab-component="Shopping.ItemMemo" data-uilab-id={`shopping-item-${item.id}-memo`}>
              <span className="shopping-item-row__detail-label">メモ</span>
              <p>{item.memo}</p>
            </div>
          ) : null}
          {item.photoSrc ? (
            <div className="shopping-item-row__photo" data-uilab-component="Shopping.ItemPhoto" data-uilab-id={`shopping-item-${item.id}-photo`}>
              <span className="shopping-item-row__detail-label">写真</span>
              <img src={item.photoSrc} alt={`${item.name}の写真`} />
            </div>
          ) : null}
          {!purchased && item.plannedDate ? (
            <div className="shopping-item-row__planned-date-detail" data-uilab-component="Shopping.ItemExpanded.PlannedDate" data-uilab-id={`shopping-item-${item.id}-planned-date-detail`}>
              購入予定日 {formatPlannedDate(item.plannedDate)}
            </div>
          ) : null}
        </div>
      ) : null}

      {!purchased ? (
        <div className="shopping-reorder-fallback" aria-label={`${item.name}の並べ替え`}>
          <button type="button" disabled={!canMoveUp} onClick={() => onMove('up')} aria-label={`${item.name}を上へ`}>
            上へ
          </button>
          <button type="button" disabled={!canMoveDown} onClick={() => onMove('down')} aria-label={`${item.name}を下へ`}>
            下へ
          </button>
        </div>
      ) : null}

      {actionsOpen ? (
        <button type="button" className="shopping-item-row__actions-dismiss" onClick={onDismissActions} aria-label="操作を閉じる">
          閉じる
        </button>
      ) : null}
    </article>
  );
}

function Avatar({ person }: { person: NonNullable<ShoppingItem['purchaser']> }) {
  return (
    <span className="shopping-avatar" role="img" aria-label={`購入者: ${person.name}`}>
      {person.initials}
    </span>
  );
}

function formatPlannedDate(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getMonth() + 1}/${value.getDate()}`;
}
