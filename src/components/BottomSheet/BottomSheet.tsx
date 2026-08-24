import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MOTION_MS } from '../../motion/constants';

type BottomSheetProps = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
  uilabComponent?: string;
  uilabId?: string;
};

export function BottomSheet({
  children,
  onClose,
  open,
  title,
  uilabComponent = 'AppShell.AddSheet',
  uilabId = 'app-add-sheet',
}: BottomSheetProps) {
  const dragStartY = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const dismissTimer = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (open) {
      setIsDismissing(false);
      setIsDragging(false);
      setDragOffset(0);
    }
    return () => {
      if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (isDismissing) return;
    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };
  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const nextOffset = Math.max(0, Math.min(180, event.clientY - dragStartY.current));
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };
  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const shouldDismiss = dragOffsetRef.current > 64;
    dragStartY.current = null;
    dragOffsetRef.current = 0;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setIsDragging(false);
    if (shouldDismiss) {
      setIsDismissing(true);
      dismissTimer.current = window.setTimeout(onClose, prefersReducedMotion ? 0 : MOTION_MS.sheet);
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div className="bottom-sheet-layer">
      <button
        type="button"
        className={`bottom-sheet__backdrop${isDismissing ? ' is-dismissing' : ''}`}
        aria-label="背景を閉じる"
        onClick={onClose}
      />
      <section
        className={`bottom-sheet${isDragging ? ' is-dragging' : ''}${isDismissing ? ' is-dismissing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        data-uilab-component={uilabComponent}
        data-uilab-id={uilabId}
        style={{ '--sheet-drag-offset': `${dragOffset}px` } as CSSProperties}
      >
        <div
          className="bottom-sheet__handle"
          aria-hidden="true"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        />
        <div className="bottom-sheet__header">
          <h2 id="bottom-sheet-title">{title}</h2>
          <button type="button" className="bottom-sheet__close" onClick={onClose}>
            閉じる
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
