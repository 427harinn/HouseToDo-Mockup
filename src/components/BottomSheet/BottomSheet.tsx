import { useEffect, type ReactNode } from 'react';

type BottomSheetProps = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function BottomSheet({
  children,
  onClose,
  open,
  title,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="bottom-sheet-layer">
      <button
        type="button"
        className="bottom-sheet__backdrop"
        aria-label="背景を閉じる"
        onClick={onClose}
      />
      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        data-uilab-component="AppShell.AddSheet"
        data-uilab-id="app-add-sheet"
      >
        <div className="bottom-sheet__handle" aria-hidden="true" />
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
