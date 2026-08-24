import { useState } from 'react';
import { useHashRoute } from './router';
import { AppShell } from '../components/AppShell/AppShell';
import { FoundationPage } from '../pages/FoundationPage';
import { HomePage } from '../pages/HomePage';
import { CalendarPage } from '../pages/CalendarPage';
import { ShoppingPage } from '../pages/ShoppingPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { getHomeUiLabState } from '../mock/homeState';
import { getCalendarUiLabState } from '../mock/calendarState';
import { getShoppingUiLabState } from '../mock/shoppingState';
import { TaskFormPage } from '../pages/TaskFormPage';
import { ShoppingFormPage } from '../pages/ShoppingFormPage';
import { EntryPage, type EntryPageKind } from '../pages/EntryPage';
import {
  AccountPage,
  HouseholdPage,
  MembersPage,
  NotificationsPage,
  OtherLandingPage,
  StoragePage,
} from '../pages/OtherPage';
import { homeFixtures, homeUiLabStates, type HomeFixture, type HomeTask, type HomeUiLabState } from '../fixtures/home';
import { getShoppingHistoryItems, shoppingFixtures, shoppingUiLabStates, type ShoppingFixture, type ShoppingItem, type ShoppingUiLabState } from '../fixtures/shopping';

export function App() {
  const route = useHashRoute();
  const [homeSessions, setHomeSessions] = useState<Partial<Record<HomeUiLabState, HomeFixture>>>({});
  const [shoppingSessions, setShoppingSessions] = useState<Partial<Record<ShoppingUiLabState, ShoppingFixture>>>({});

  const readHomeState = (value: string | null): HomeUiLabState => (
    value && homeUiLabStates.includes(value as HomeUiLabState) ? value as HomeUiLabState : 'normal'
  );

  const updateHomeSession = (state: HomeUiLabState, update: (fixture: HomeFixture) => HomeFixture) => {
    setHomeSessions((current) => {
      const base = current[state] ?? homeFixtures[state];
      return { ...current, [state]: update(base) };
    });
  };

  const readShoppingState = (value: string | null): ShoppingUiLabState => (
    value && shoppingUiLabStates.includes(value as ShoppingUiLabState) ? value as ShoppingUiLabState : 'normal'
  );

  const updateShoppingSession = (state: ShoppingUiLabState, update: (fixture: ShoppingFixture) => ShoppingFixture) => {
    setShoppingSessions((current) => {
      const base = current[state] ?? shoppingFixtures[state];
      return { ...current, [state]: update(base) };
    });
  };

  if (route.pathname === '/foundation') {
    return <FoundationPage routePath={route.pathname} />;
  }

  const entryPageKinds: Partial<Record<string, EntryPageKind>> = {
    '/login': 'login',
    '/register': 'register',
    '/household/create': 'household-create',
    '/household/join': 'household-join',
  };
  const entryPageKind = entryPageKinds[route.pathname];
  if (entryPageKind) {
    return (
      <AppShell currentPath="" showBottomNavigation={false}>
        <EntryPage key={`${route.pathname}-${route.searchParams.get('uilabState') ?? 'normal'}`} kind={entryPageKind} state={route.searchParams.get('uilabState') ?? 'normal'} />
      </AppShell>
    );
  }

  if (route.pathname === '/tasks/new' || route.pathname === '/tasks/edit') {
    const isEdit = route.pathname === '/tasks/edit';
    const homeState = readHomeState(route.searchParams.get('homeState'));
    const taskId = route.searchParams.get('taskId') ?? undefined;
    const homeSession = homeSessions[homeState] ?? homeFixtures[homeState];
    const editTask = isEdit && taskId ? findHomeTask(homeSession, taskId) : undefined;
    return (
      <AppShell currentPath="" showBottomNavigation={false}>
        <TaskFormPage
          key={`${route.pathname}-${route.searchParams.get('uilabState') ?? 'normal'}`}
          isEdit={isEdit}
          state={route.searchParams.get('uilabState') ?? 'normal'}
          initialTask={editTask}
          onTaskSave={taskId ? (task) => updateHomeSession(homeState, (fixture) => updateTaskInFixture(fixture, taskId, task)) : undefined}
          onTaskDelete={taskId ? () => updateHomeSession(homeState, (fixture) => deleteTaskInFixture(fixture, taskId)) : undefined}
          homeState={route.searchParams.get('homeState') ?? undefined}
        />
      </AppShell>
    );
  }

  if (route.pathname === '/shopping/new' || route.pathname === '/shopping/edit') {
    const isEdit = route.pathname === '/shopping/edit';
    const shoppingState = readShoppingState(route.searchParams.get('shoppingState'));
    const shoppingSession = shoppingSessions[shoppingState] ?? shoppingFixtures[shoppingState];
    const requestedItemId = route.searchParams.get('item');
    const editItem = isEdit && requestedItemId
      ? findShoppingItem(shoppingSession, requestedItemId)
      : undefined;
    return (
      <AppShell currentPath="" showBottomNavigation={false}>
        <ShoppingFormPage
          key={`${route.pathname}-${route.searchParams.get('uilabState') ?? 'normal'}-${editItem?.id ?? ''}`}
          isEdit={isEdit}
          state={route.searchParams.get('uilabState') ?? 'normal'}
          initialItem={editItem}
          reuseItems={getShoppingHistoryItems(shoppingSession)}
          onDelete={isEdit && editItem ? () => {
            updateShoppingSession(shoppingState, (fixture) => removeShoppingItem(fixture, editItem.id));
            window.location.hash = `#/shopping?uilabState=${encodeURIComponent(shoppingState)}`;
          } : undefined}
        />
      </AppShell>
    );
  }

  if (route.pathname === '/other/members' || route.pathname === '/other/notifications' || route.pathname === '/other/storage' || route.pathname === '/other/household' || route.pathname === '/other/account') {
    const state = route.searchParams.get('uilabState') ?? 'normal';
    const page = route.pathname === '/other/members'
        ? <MembersPage key={`${route.pathname}-${state}`} state={state} />
        : route.pathname === '/other/notifications'
          ? <NotificationsPage key={`${route.pathname}-${state}`} state={state} />
          : route.pathname === '/other/storage'
            ? <StoragePage key={`${route.pathname}-${state}`} state={state} />
            : route.pathname === '/other/household'
              ? <HouseholdPage key={`${route.pathname}-${state}`} state={state} />
              : <AccountPage key={`${route.pathname}-${state}`} state={state} />;

    return <AppShell currentPath="" showBottomNavigation={false}>{page}</AppShell>;
  }

  const placeholderTitles: Record<string, string> = {
    '/home': 'ホーム',
    '/calendar': 'カレンダー',
    '/shopping': '買い物',
    '/other': 'その他',
  };
  const placeholderTitle = placeholderTitles[route.pathname];

  if (placeholderTitle) {
    if (route.pathname === '/home') {
      const homeState = getHomeUiLabState(
        `#${route.pathname}?${route.searchParams.toString()}`,
      );

      return (
        <AppShell currentPath={route.pathname}>
          <HomePage
            key={homeState}
            state={homeState}
            session={homeSessions[homeState]}
            onSessionChange={(fixture) => setHomeSessions((current) => ({ ...current, [homeState]: fixture }))}
          />
        </AppShell>
      );
    }

    if (route.pathname === '/calendar') {
      const calendarState = getCalendarUiLabState(
        `#${route.pathname}?${route.searchParams.toString()}`,
      );

      return (
        <AppShell currentPath={route.pathname}>
          <CalendarPage key={calendarState} state={calendarState} />
        </AppShell>
      );
    }

    if (route.pathname === '/shopping') {
      const shoppingState = getShoppingUiLabState(
        `#${route.pathname}?${route.searchParams.toString()}`,
      );

      return (
        <AppShell currentPath={route.pathname}>
          <ShoppingPage
            key={`${shoppingState}-${route.searchParams.get('item') ?? ''}`}
            state={shoppingState}
            initialItemId={route.searchParams.get('item')}
            fixtureOverride={shoppingSessions[shoppingState]}
            onSessionChange={(fixture) => setShoppingSessions((current) => ({ ...current, [shoppingState]: fixture }))}
          />
        </AppShell>
      );
    }

    if (route.pathname === '/other') {
      return <AppShell currentPath={route.pathname}><OtherLandingPage /></AppShell>;
    }

    return <AppShell currentPath={route.pathname}><PlaceholderPage title={placeholderTitle} /></AppShell>;
  }

  return (
    <main className="route-error-page">
      <h1>ページが見つかりません</h1>
      <p>ルートが見つかりません。</p>
      <a href="#/home">ホームを開く</a>
    </main>
  );
}

function findHomeTask(fixture: HomeFixture, taskId: string): HomeTask | undefined {
  return fixture.activeTasks.find((task) => task.id === taskId)
    ?? fixture.completedTasks.find((task) => task.taskId === taskId)?.task
    ?? fixture.passedTasks.find((task) => task.taskId === taskId)?.task;
}

function updateTaskInFixture(fixture: HomeFixture, taskId: string, updates: Pick<HomeTask, 'name' | 'assignee'>): HomeFixture {
  return {
    ...fixture,
    activeTasks: fixture.activeTasks.map((task) => task.id === taskId ? { ...task, ...updates } : task),
    completedTasks: fixture.completedTasks.map((task) => task.taskId === taskId ? { ...task, task: { ...task.task, ...updates } } : task),
    passedTasks: fixture.passedTasks.map((task) => task.taskId === taskId ? { ...task, task: { ...task.task, ...updates } } : task),
  };
}

function deleteTaskInFixture(fixture: HomeFixture, taskId: string): HomeFixture {
  return {
    ...fixture,
    activeTasks: fixture.activeTasks.filter((task) => task.id !== taskId),
    completedTasks: fixture.completedTasks.map((task) => task.taskId === taskId ? { ...task, deleted: true } : task),
    passedTasks: fixture.passedTasks.map((task) => task.taskId === taskId ? { ...task, deleted: true } : task),
  };
}

function findShoppingItem(fixture: ShoppingFixture, itemId: string | null): ShoppingItem | undefined {
  if (!itemId) return undefined;
  return fixture.activeItems.find((item) => item.id === itemId)
    ?? fixture.purchasedItems.find((item) => item.id === itemId);
}

function removeShoppingItem(fixture: ShoppingFixture, itemId: string): ShoppingFixture {
  return {
    ...fixture,
    activeItems: fixture.activeItems.filter((item) => item.id !== itemId),
    purchasedItems: fixture.purchasedItems.filter((item) => item.id !== itemId),
    historyItems: getShoppingHistoryItems(fixture).filter((item) => item.id !== itemId),
  };
}
