import { ChevronLeft, ChevronRight, Ellipsis, ShoppingCart, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calendarFixtures,
  type CalendarFixture,
  type CalendarPerson,
  type CalendarTask,
  type CalendarUiLabState,
} from '../fixtures/calendar';
import type { ShoppingFixture, ShoppingItem } from '../fixtures/shopping';
import { getCalendarUiLabState } from '../mock/calendarState';
import { MOCK_TODAY } from '../mock/constants';

const INITIAL_MONTH = '2026-08-01';
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MOCK_COMPLETER: CalendarPerson = { id: 'haru', name: 'はる', initials: 'は' };

type CalendarPageProps = {
  state?: CalendarUiLabState;
  fixtureOverride?: CalendarFixture;
  shoppingFixture?: ShoppingFixture;
  initialSelectedDate?: string | null;
  onSessionChange?: (fixture: CalendarFixture) => void;
};

export function CalendarPage({ state = getCalendarUiLabState(), fixtureOverride, shoppingFixture, initialSelectedDate, onSessionChange }: CalendarPageProps) {
  const fixture = fixtureOverride ?? calendarFixtures[state];
  const [monthDate, setMonthDate] = useState(INITIAL_MONTH);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialSelectedDate ?? fixture.selectedDate ?? null,
  );
  const [tasks, setTasks] = useState<CalendarTask[]>(fixture.tasks);
  const [statusMessage, setStatusMessage] = useState('');
  const monthGridStart = useRef<{ x: number; y: number } | null>(null);
  const suppressMonthGridClick = useRef(false);

  useEffect(() => {
    setMonthDate(INITIAL_MONTH);
    setSelectedDate(initialSelectedDate ?? fixture.selectedDate ?? null);
    setTasks(fixture.tasks);
    setStatusMessage('');
  }, [initialSelectedDate, state]);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => !task.completed && !task.passed && !task.deleted),
    [tasks],
  );
  const shoppingItems = shoppingFixture
    ? [...shoppingFixture.activeItems, ...shoppingFixture.purchasedItems]
    : fixture.shoppingItems;
  const monthDays = useMemo(() => getMonthDays(monthDate), [monthDate]);
  const maxCellTasks = getMaxCellTasks();

  const openDate = (date: string) => setSelectedDate(date);
  const moveMonth = (amount: number) => {
    setMonthDate((current) => {
      const next = new Date(`${current}T12:00:00`);
      next.setMonth(next.getMonth() + amount, 1);
      return toDateString(next);
    });
  };
  const goToToday = () => setMonthDate(MOCK_TODAY.slice(0, 8) + '01');
  const handleMonthGridPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    suppressMonthGridClick.current = false;
    monthGridStart.current = { x: event.clientX, y: event.clientY };
  };
  const handleMonthGridPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (!monthGridStart.current) return;

    const deltaX = event.clientX - monthGridStart.current.x;
    const deltaY = event.clientY - monthGridStart.current.y;
    monthGridStart.current = null;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      suppressMonthGridClick.current = true;
      moveMonth(deltaX < 0 ? 1 : -1);
    }
  };
  const handleMonthGridPointerCancel = () => {
    monthGridStart.current = null;
    suppressMonthGridClick.current = false;
  };
  const handleMonthGridClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (!suppressMonthGridClick.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressMonthGridClick.current = false;
  };

  const commitTasks = (nextTasks: CalendarTask[]) => {
    setTasks(nextTasks);
    onSessionChange?.({ ...fixture, tasks: nextTasks });
  };

  const completeTask = (task: CalendarTask) => {
    const completionDate = selectedDate ?? MOCK_TODAY;
    const nextTasks = tasks.map((item) => item.id === task.id ? {
      ...item,
      completed: true,
      completedBy: MOCK_COMPLETER,
      completionHistory: [
        ...(item.completionHistory ?? []).filter((entry) => !(entry.date === completionDate && entry.outcome === 'completed')),
        { date: completionDate, outcome: 'completed' as const },
      ],
    } : item);
    commitTasks(nextTasks);
    setStatusMessage(`「${task.name}」を完了しました`);
  };

  const passTask = (task: CalendarTask) => {
    commitTasks(tasks.map((item) => item.id === task.id ? { ...item, passed: true } : item));
    setStatusMessage(`「${task.name}」をパスしました`);
  };

  const restoreCompleted = (task: CalendarTask) => {
    const completionDate = selectedDate ?? MOCK_TODAY;
    commitTasks(tasks.map((item) => item.id === task.id ? {
      ...item,
      completed: false,
      deleted: false,
      completedBy: undefined,
      completionHistory: item.completionHistory?.filter((entry) => !(entry.date === completionDate && entry.outcome === 'completed')),
    } : item));
    setStatusMessage(`「${task.name}」を戻しました`);
  };

  const navigateToEdit = (taskId: string, date: string) => {
    window.location.hash = `#/tasks/edit?origin=calendar&calendarState=${encodeURIComponent(state)}&calendarDate=${encodeURIComponent(date)}&taskId=${encodeURIComponent(taskId)}`;
  };

  return (
    <div className="screen-content calendar-page" data-uilab-component="Calendar.Page" data-uilab-id="calendar-page">
      <header className="calendar-header" data-uilab-component="Calendar.Header" data-uilab-id="calendar-header">
        <div className="calendar-header__title-row">
          <button
            type="button"
            className="calendar-icon-button"
            aria-label="前の月"
            onClick={() => moveMonth(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <h1>{formatMonthLabel(monthDate)}</h1>
          <button
            type="button"
            className="calendar-icon-button"
            aria-label="次の月"
            onClick={() => moveMonth(1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div className="calendar-header__today-row">
          <button type="button" className="calendar-today-button" onClick={goToToday}>
            今日
          </button>
        </div>
      </header>

      <section
        className={`calendar-month-grid calendar-month-grid--${monthDays.length / 7}`}
        aria-label={`${formatMonthLabel(monthDate)}のカレンダー`}
        data-uilab-component="Calendar.MonthGrid"
        data-uilab-id="calendar-month-grid"
        onPointerDown={handleMonthGridPointerDown}
        onPointerUp={handleMonthGridPointerUp}
        onPointerCancel={handleMonthGridPointerCancel}
        onClickCapture={handleMonthGridClickCapture}
      >
        <div className="calendar-weekday-row" aria-hidden="true">
          {WEEKDAYS.map((weekday, index) => (
            <span key={weekday} className={index === 0 ? 'is-sunday' : index === 6 ? 'is-saturday' : ''}>
              {weekday}
            </span>
          ))}
        </div>
        <div className="calendar-grid-body">
          {monthDays.map((day) => {
            const dayTasks = visibleTasks.filter((task) => task.date === day.date);
            const dayShopping = getScheduledShopping(shoppingItems, day.date);
            const displayedTasks = dayTasks.slice(0, maxCellTasks);
            const moreCount = dayTasks.length - displayedTasks.length;

            return (
              <div
                key={day.date}
                className={`calendar-day-cell${day.isCurrentMonth ? '' : ' is-outside-month'}${dayShopping.length > 0 ? ' has-shopping' : ''}`}
                data-uilab-component="Calendar.DayCell"
                data-uilab-id={day.date}
                role="button"
                tabIndex={0}
                aria-label={`${formatDateLabel(day.date)}${dayTasks.length ? `、タスク${dayTasks.length}件` : ''}${dayShopping.length ? `、買い物${dayShopping.length}件` : ''}`}
                onClick={() => openDate(day.date)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openDate(day.date);
                  }
                }}
              >
                <span
                    className={`calendar-day-number calendar-day-number--${day.weekday}${day.date === MOCK_TODAY ? ' is-today' : ''}`}
                  data-uilab-component="Calendar.DayCell.Date"
                  data-uilab-id={`calendar-day-${day.date}-date`}
                >
                  {day.dayNumber}
                </span>
                <div className="calendar-day-tasks">
                  {displayedTasks.map((task) => (
                    <button
                      type="button"
                      className={`calendar-day-task${task.deadline ? ' is-deadline' : ''}`}
                      key={task.id}
                      data-uilab-component="Calendar.DayCell.Task"
                      data-uilab-id={task.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        openDate(day.date);
                      }}
                      title={task.name}
                    >
                      {task.name}
                    </button>
                  ))}
                  {moreCount > 0 ? (
                    <button
                      type="button"
                      className="calendar-day-more"
                      data-uilab-component="Calendar.DayCell.More"
                      data-uilab-id={`calendar-day-${day.date}-more`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openDate(day.date);
                      }}
                    >
                      +{moreCount}
                    </button>
                  ) : null}
                </div>
                {dayShopping.length > 0 ? (
                  <span
                    className="calendar-day-shopping"
                    aria-hidden="true"
                    data-uilab-component="Calendar.DayCell.ShoppingCount"
                    data-uilab-id={`calendar-day-${day.date}-shopping`}
                  >
                    <ShoppingCart aria-hidden="true" />
                    <span>{dayShopping.length}</span>
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <p className="calendar-status" role="status" aria-live="polite">
        {statusMessage}
      </p>

      <CalendarDateSheet
        date={selectedDate}
        completedOpen={fixture.completedOpen}
        initialActions={fixture.initialActions}
        tasks={tasks}
        shoppingItems={shoppingItems}
        onClose={() => setSelectedDate(null)}
        onComplete={completeTask}
        onPass={passTask}
        onRestore={restoreCompleted}
        onEdit={navigateToEdit}
        onNavigate={openDate}
      />
    </div>
  );
}

function CalendarDateSheet({
  completedOpen: completedOpenInitial,
  date,
  initialActions,
  onClose,
  onComplete,
  onEdit,
  onNavigate,
  onRestore,
  shoppingItems,
  onPass,
  tasks,
}: {
  completedOpen?: boolean;
  date: string | null;
  initialActions?: { taskId: string };
  onClose: () => void;
  onComplete: (task: CalendarTask) => void;
  onEdit: (taskId: string, date: string) => void;
  onNavigate: (date: string) => void;
  onRestore: (task: CalendarTask) => void;
  onPass: (task: CalendarTask) => void;
  tasks: CalendarTask[];
  shoppingItems: ShoppingItem[];
}) {
  const startX = useRef<number | null>(null);
  const [completedOpen, setCompletedOpen] = useState(completedOpenInitial ?? false);
  useEffect(() => setCompletedOpen(completedOpenInitial ?? false), [completedOpenInitial, date]);
  const directTasks = date ? tasks.filter((task) => !task.completed && !task.passed && !task.deleted && task.date === date) : [];
  const periodTasks = date
    ? tasks.filter(
        (task) =>
          !task.completed &&
          !task.passed &&
          !task.deleted &&
          task.date !== date &&
          task.periodStart &&
          task.periodEnd &&
          task.periodStart <= date &&
          date <= task.periodEnd,
      )
    : [];
  const completedTasks = date
    ? tasks.filter((task) => task.completed && task.completionHistory?.some((entry) => entry.date === date && entry.outcome === 'completed'))
    : [];
  const dateShopping = date ? getScheduledShopping(shoppingItems, date) : [];

  if (!date) return null;

  const moveDate = (amount: number) => onNavigate(toDateString(addDays(date, amount)));

  return (
    <div className="calendar-date-layer">
      <button
        type="button"
        className="calendar-date-backdrop"
        aria-label="背景を閉じる"
        onClick={onClose}
      />
      <section
        className="calendar-date-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-date-sheet-title"
        data-uilab-component="Calendar.DateSheet"
        data-uilab-id="calendar-date-sheet"
        onPointerDown={(event) => {
          startX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const distance = startX.current - event.clientX;
          startX.current = null;
          if (Math.abs(distance) > 48) moveDate(distance > 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        <div className="calendar-date-sheet__handle" aria-hidden="true" />
        <header className="calendar-date-sheet__header">
          <button type="button" className="calendar-date-sheet__close" onClick={onClose}>
            <X aria-hidden="true" />
            <span>閉じる</span>
          </button>
          <div className="calendar-date-sheet__nav" aria-label="日付を移動">
            <button type="button" aria-label="前の日" onClick={() => moveDate(-1)}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" aria-label="次の日" onClick={() => moveDate(1)}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </header>
        <div className="calendar-date-sheet__content">
          <h2 id="calendar-date-sheet-title" data-uilab-component="Calendar.DateSheet.Date" data-uilab-id="calendar-date-sheet-date">
            {formatDateLabel(date)}
          </h2>
          <DateSection
            label="この日"
            tasks={directTasks}
            component="Calendar.DateSheet.TodaySection"
            onComplete={onComplete}
            onEdit={onEdit}
            onPass={onPass}
            date={date}
          />
          <DateSection
            label="期間中"
            tasks={periodTasks}
            component="Calendar.DateSheet.PeriodSection"
            onComplete={onComplete}
            onEdit={onEdit}
            onPass={onPass}
            date={date}
          />
          {completedTasks.length > 0 ? (
            <section className="home-completed calendar-completed-section" data-uilab-component="Calendar.DateSheet.CompletedSection" data-uilab-id="calendar-date-sheet-completed">
              <button type="button" className="home-completed__toggle" aria-expanded={completedOpen} onClick={() => setCompletedOpen((open) => !open)}>
                <span>完了済み {completedTasks.length}</span>
                <ChevronRight aria-hidden="true" className={completedOpen ? 'is-open' : ''} />
              </button>
              {completedOpen ? (
                <div className="home-history__list home-completed__list calendar-completed-list">
                  {completedTasks.map((task) => (
                    <CalendarHistoryRow
                      key={task.id}
                      task={task}
                      initialOpen={initialActions?.taskId === task.id}
                      onEdit={() => onEdit(task.id, date)}
                      onRestore={() => onRestore(task)}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}
          {dateShopping.length > 0 ? (
            <section className="calendar-shopping-section" data-uilab-component="Calendar.DateSheet.ShoppingSection" data-uilab-id="calendar-date-sheet-shopping">
              <h3>買うもの</h3>
              <div className="calendar-shopping-list">
                {dateShopping.map((item) => (
                  <button
                    type="button"
                    className="calendar-shopping-row"
                    key={item.id}
                    data-uilab-component="Calendar.DateSheet.ShoppingRow"
                    data-uilab-id={`calendar-shopping-${item.id}`}
                    onClick={() => {
                      window.location.hash = `#/shopping?item=${encodeURIComponent(item.id)}`;
                    }}
                  >
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function DateSection({
  component,
  label,
  onComplete,
  onEdit,
  onPass,
  date,
  tasks,
}: {
  component: string;
  label: string;
  onComplete: (task: CalendarTask) => void;
  onEdit: (taskId: string, date: string) => void;
  onPass: (task: CalendarTask) => void;
  date: string | null;
  tasks: CalendarTask[];
}) {
  return (
    <section className="calendar-date-section" data-uilab-component={component}>
      <h3>{label}</h3>
      {tasks.length > 0 ? (
        <div className="calendar-detail-task-list">
          {tasks.map((task) => (
            <CalendarDetailTask
              key={task.id}
              task={task}
              onComplete={() => onComplete(task)}
              onEdit={() => date && onEdit(task.id, date)}
              onPass={() => onPass(task)}
            />
          ))}
        </div>
      ) : (
        <p className="calendar-date-section__empty">なし</p>
      )}
    </section>
  );
}

function CalendarDetailTask({
  onEdit,
  onComplete,
  onPass,
  task,
}: {
  onComplete: () => void;
  onEdit: () => void;
  onPass: () => void;
  task: CalendarTask;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const startX = useRef<number | null>(null);
  const suppressClick = useRef(false);

  return (
    <div
      className={`calendar-detail-task${actionsOpen ? ' is-actions-open' : ''}`}
      data-uilab-component="Calendar.DetailTask"
      data-uilab-id={task.id}
      onPointerDown={(event) => {
        event.stopPropagation();
        suppressClick.current = false;
        startX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (startX.current !== null && startX.current - event.clientX > 48) {
          suppressClick.current = true;
          setActionsOpen(true);
        }
        startX.current = null;
      }}
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        if (event.target instanceof Element && event.target.closest('.calendar-detail-task__actions')) {
          suppressClick.current = false;
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        startX.current = null;
      }}
    >
      <button type="button" className="calendar-detail-task__main" onClick={onComplete}>
        <span className="calendar-detail-task__check" aria-hidden="true" />
        <span>{task.name}</span>
      </button>
      <button
        type="button"
        className="calendar-detail-task__more"
        aria-label={`${task.name}の操作`}
        aria-expanded={actionsOpen}
        hidden={actionsOpen}
        onClick={() => setActionsOpen((open) => !open)}
      >
        …
      </button>
      {actionsOpen ? (
        <div className="calendar-detail-task__actions" aria-label={`${task.name}の操作メニュー`}>
          <button type="button" onClick={onEdit}>
            編集
          </button>
          <button type="button" className="is-pass" onClick={onPass}>
            パス
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CalendarHistoryRow({ initialOpen, onEdit, onRestore, task }: { initialOpen: boolean; onEdit: () => void; onRestore: () => void; task: CalendarTask }) {
  const { actionsOpen, handleClickCapture, handlePointerCancel, handlePointerDown, handlePointerUp, setActionsOpen } = useHistoryRowActions(initialOpen);
  const isDeleted = task.deleted === true;
  return (
    <div
      className={`home-task-row home-history-row home-task-row--completed${isDeleted ? ' is-deleted' : ''}${actionsOpen ? ' is-actions-open' : ''}`}
      data-uilab-component="Calendar.CompletedRow"
      data-uilab-id={task.id}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
    >
      <div className="home-task-row__content">
        <div className="home-history-row__main">
          <span className="home-task-row__details"><span className="home-task-row__name">{task.name}</span></span>
          {task.completedBy ? <span className="home-avatar" role="img" aria-label={`完了者: ${task.completedBy.name}`} data-uilab-component="Home.TaskRow.Avatar">{task.completedBy.initials}</span> : null}
        </div>
        <button type="button" className="home-task-row__more" aria-label={`${task.name}の操作`} aria-expanded={actionsOpen} onClick={() => setActionsOpen((open) => !open)}><Ellipsis aria-hidden="true" /></button>
      </div>
      {actionsOpen ? (
        <div className={`home-task-row__actions${isDeleted ? ' home-task-row__actions--restore-only' : ''}`} aria-label={`${task.name}の操作メニュー`}>
          <span className="home-task-row__actions-spacer" aria-hidden="true" />
          {!isDeleted ? <button type="button" data-uilab-component="Calendar.CompletedRow.Edit" onClick={onEdit}>編集</button> : null}
          <button type="button" className="is-restore" data-uilab-component="Calendar.CompletedRow.Restore" onClick={onRestore}>戻す</button>
        </div>
      ) : null}
    </div>
  );
}

function useHistoryRowActions(initialOpen = false) {
  const [actionsOpen, setActionsOpen] = useState(initialOpen);
  const startX = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => { event.stopPropagation(); startX.current = event.clientX; };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (startX.current === null) return;
    const distance = startX.current - event.clientX;
    startX.current = null;
    if (distance > 48) { suppressClick.current = true; setActionsOpen(true); }
  };
  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => { event.stopPropagation(); startX.current = null; };
  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    if (event.target instanceof Element && event.target.closest('.home-task-row__actions')) { suppressClick.current = false; return; }
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  };
  return { actionsOpen, handleClickCapture, handlePointerCancel, handlePointerDown, handlePointerUp, setActionsOpen };
}

type MonthDay = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  weekday: number;
};

function getMonthDays(monthDate: string): MonthDay[] {
  const month = new Date(`${monthDate}T12:00:00`);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const weekCount = 6;

  return Array.from({ length: weekCount * 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return {
      date: toDateString(day),
      dayNumber: day.getDate(),
      isCurrentMonth: day.getMonth() === month.getMonth(),
      weekday: day.getDay(),
    };
  });
}

function getMaxCellTasks() {
  return 2;
}

function addDays(date: string, amount: number) {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + amount);
  return next;
}

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMonthLabel(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getFullYear()}年${value.getMonth() + 1}月`;
}

function formatDateLabel(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getMonth() + 1}月${value.getDate()}日 ${WEEKDAYS[value.getDay()]}曜日`;
}

export function getScheduledShopping(items: ShoppingItem[], date: string) {
  return items.filter((item) => item.plannedDate === date && !item.purchasedAt);
}
