import {
  ChevronRight,
  Ellipsis,
  Image as ImageIcon,
  MessageCircle,
  ShoppingCart,
  Undo2,
} from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  shoppingFixtures,
  type ShoppingItem,
  type ShoppingUiLabState,
} from '../fixtures/shopping';
import { getShoppingUiLabState } from '../mock/shoppingState';

type ShoppingPageProps = {
  state?: ShoppingUiLabState;
};

export function ShoppingPage({ state = getShoppingUiLabState() }: ShoppingPageProps) {
  const fixture = shoppingFixtures[state];
  const [activeItems, setActiveItems] = useState<ShoppingItem[]>(fixture.activeItems);
  const [purchasedItems, setPurchasedItems] = useState<ShoppingItem[]>(
    fixture.purchasedItems,
  );
  const [expandedId, setExpandedId] = useState<string | null>(
    fixture.initialExpandedId ?? null,
  );
  const [purchasedOpen, setPurchasedOpen] = useState(
    fixture.initialPurchasedOpen ?? false,
  );
  const [actionsOpenId, setActionsOpenId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setActiveItems(fixture.activeItems);
    setPurchasedItems(fixture.purchasedItems);
    setExpandedId(fixture.initialExpandedId ?? null);
    setPurchasedOpen(fixture.initialPurchasedOpen ?? false);
    setActionsOpenId(null);
    setDraggingId(null);
    setDragOverId(null);
    setStatusMessage('');
  }, [fixture, state]);

  const toggleExpanded = (itemId: string) => {
    setExpandedId((current) => (current === itemId ? null : itemId));
    setActionsOpenId(null);
  };

  const purchaseItem = (item: ShoppingItem) => {
    setActiveItems((current) => current.filter((activeItem) => activeItem.id !== item.id));
    setPurchasedItems((current) => [
      ...current,
      { ...item, purchasedAt: '今日 17:42', purchaser: item.purchaser ?? { id: 'yuki', name: 'ゆき', initials: 'ゆ' } },
    ]);
    setExpandedId(null);
    setActionsOpenId(null);
    setStatusMessage(`「${item.name}」を購入済みに移しました`);
  };

  const restoreItem = (item: ShoppingItem) => {
    const restored: ShoppingItem = { ...item };
    delete restored.purchasedAt;
    delete restored.purchaser;
    setPurchasedItems((current) => current.filter((purchasedItem) => purchasedItem.id !== item.id));
    setActiveItems((current) =>
      [...current, restored].sort((left, right) => left.addedAt.localeCompare(right.addedAt)),
    );
    setExpandedId(null);
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
    <div className="screen-content shopping-page" data-uilab-component="Shopping.Page">
      <header className="shopping-header" data-uilab-component="Shopping.Header">
        <h1>買い物</h1>
      </header>

      {activeItems.length > 0 ? (
        <section
          className="shopping-active-list"
          aria-label="未購入の買い物一覧"
          data-uilab-component="Shopping.ActiveList"
        >
          {activeItems.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              actionsOpen={actionsOpenId === item.id}
              dragging={draggingId === item.id}
              dragSessionActive={draggingId !== null}
              dragOver={dragOverId === item.id}
              onToggle={() => toggleExpanded(item.id)}
              onPurchase={() => purchaseItem(item)}
              onRestore={() => restoreItem(item)}
              onEdit={() => setStatusMessage('編集はM6で実装します')}
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
        <section className="shopping-empty-state" aria-label="買うものなし" data-uilab-component="Shopping.EmptyState">
          <div className="shopping-empty-state__illustration" aria-hidden="true">
            <ShoppingCart />
            <span>✓</span>
          </div>
          <p>買うものはありません</p>
        </section>
      )}

      <section className="shopping-purchased" data-uilab-component="Shopping.PurchasedSection">
        <button
          type="button"
          className="shopping-purchased__toggle"
          aria-expanded={purchasedOpen}
          onClick={() => setPurchasedOpen((open) => !open)}
        >
          <span>購入済み {purchasedItems.length}件</span>
          <ChevronRight aria-hidden="true" className={purchasedOpen ? 'is-open' : ''} />
        </button>
        {purchasedOpen && purchasedItems.length > 0 ? (
          <div className="shopping-purchased__list">
            {purchasedItems.map((item) => (
              <ShoppingItemRow
                key={item.id}
                item={item}
                purchased
                expanded={expandedId === item.id}
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

type ShoppingItemRowProps = {
  item: ShoppingItem;
  purchased?: boolean;
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

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    gestureStart.current = { x: event.clientX, y: event.clientY };
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
      onSwipeOpen();
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
      className={`shopping-item-row${expanded ? ' is-expanded' : ''}${actionsOpen ? ' is-actions-open' : ''}${dragging ? ' is-dragging' : ''}${dragOver ? ' is-drag-over' : ''}`}
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
      }}
      onClickCapture={handleClickCapture}
    >
      <div className="shopping-item-row__content">
        <button
          type="button"
          className="shopping-item-row__main"
          aria-expanded={expanded}
          onClick={onToggle}
        >
          {purchased ? (
            <span className="shopping-item-row__purchased-details">
              <span className="shopping-item-row__name">{item.name}</span>
              <span className="shopping-item-row__meta">
                {item.purchasedAt ?? '購入済み'}
              </span>
            </span>
          ) : (
            <span className="shopping-item-row__name" data-uilab-component="Shopping.ItemRow.Name">
              {item.name}
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
          <span className="shopping-item-row__quantity" data-uilab-component="Shopping.ItemRow.Quantity">
            {item.quantity}
          </span>
          {purchased && item.purchaser ? <Avatar person={item.purchaser} /> : null}
        </button>
        {!purchased ? (
          <button
            type="button"
            className="shopping-item-row__more"
            aria-label={`${item.name}の操作`}
            aria-expanded={actionsOpen}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => (actionsOpen ? onDismissActions() : onSwipeOpen())}
          >
            <Ellipsis aria-hidden="true" />
          </button>
        ) : null}
        {!purchased && actionsOpen ? (
          <div className="shopping-item-row__actions" aria-label={`${item.name}の操作メニュー`}>
            <button type="button" onClick={onEdit}>
              編集
            </button>
          </div>
        ) : null}
      </div>

      {expanded ? (
        <div className="shopping-item-row__expanded" data-uilab-component="Shopping.ItemExpanded">
          <button
            type="button"
            className="shopping-item-row__primary-action"
            onClick={purchased ? onRestore : onPurchase}
            data-uilab-component={purchased ? 'Shopping.PurchasedRestoreButton' : 'Shopping.ItemPurchaseButton'}
          >
            {purchased ? <Undo2 aria-hidden="true" /> : null}
            {purchased ? '戻す' : '購入'}
          </button>
          {item.memo ? (
            <div className="shopping-item-row__memo" data-uilab-component="Shopping.ItemMemo">
              <span className="shopping-item-row__detail-label">メモ</span>
              <p>{item.memo}</p>
            </div>
          ) : null}
          {item.photoSrc ? (
            <div className="shopping-item-row__photo" data-uilab-component="Shopping.ItemPhoto">
              <span className="shopping-item-row__detail-label">写真</span>
              <img src={item.photoSrc} alt={`${item.name}の写真`} />
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
