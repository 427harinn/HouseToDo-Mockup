import { useState, type ReactNode } from 'react';
import { BottomNavigation } from '../BottomNavigation/BottomNavigation';
import { BottomSheet } from '../BottomSheet/BottomSheet';

type AppShellProps = {
  children: ReactNode;
  currentPath: string;
  showBottomNavigation?: boolean;
};

export function AppShell({
  children,
  currentPath,
  showBottomNavigation = true,
}: AppShellProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  return (
    <div className="app-shell">
      <main className="app-shell__viewport">{children}</main>
      {showBottomNavigation ? (
        <>
          <BottomNavigation
            addOpen={isAddSheetOpen}
            currentPath={currentPath}
            onAdd={() => setIsAddSheetOpen(true)}
          />
          <BottomSheet
            open={isAddSheetOpen}
            title="追加"
            onClose={() => setIsAddSheetOpen(false)}
          >
            <div className="add-action-sheet__options">
              <button
                type="button"
                className="add-action-sheet__option"
                onClick={() => {
                  window.location.hash = '#/tasks/new';
                  setIsAddSheetOpen(false);
                }}
              >
                家事
              </button>
              <button
                type="button"
                className="add-action-sheet__option"
                onClick={() => {
                  window.location.hash = '#/shopping/new';
                  setIsAddSheetOpen(false);
                }}
              >
                買い物
              </button>
            </div>
          </BottomSheet>
        </>
      ) : null}
    </div>
  );
}
