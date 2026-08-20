import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calendarFixtures,
  type CalendarTask,
  type CalendarUiLabState,
} from '../fixtures/calendar';
import { getCalendarUiLabState } from '../mock/calendarState';

const TODAY = '2026-08-20';
const INITIAL_MONTH = '2026-08-01';
const MAX_CELL_TASKS = 2;
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

type CalendarPageProps = {
  state?: CalendarUiLabState;
};

export function CalendarPage({ state = getCalendarUiLabState() }: CalendarPageProps) {
  const fixture = calendarFixtures[state];
  const [monthDate, setMonthDate] = useState(INITIAL_MONTH);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    fixture.selectedDate ?? null,
  );
  const [tasks, setTasks] = useState<CalendarTask[]>(fixture.tasks);
  const [completedCount, setCompletedCount] = useState(
    fixture.tasks.filter((task) => task.completed).length,
  );
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setMonthDate(INITIAL_MONTH);
    setSelectedDate(fixture.selectedDate ?? null);
    setTasks(fixture.tasks);
    setCompletedCount(fixture.tasks.filter((task) => task.completed).length);
    setStatusMessage('');
  }, [fixture, state]);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => !task.completed && !task.passed),
    [tasks],
  );
  const monthDays = useMemo(() => getMonthDays(monthDate), [monthDate]);

  const openDate = (date: string) => setSelectedDate(date);
  const moveMonth = (amount: number) => {
    setMonthDate((current) => {
      const next = new Date(`${current}T12:00:00`);
      next.setMonth(next.getMonth() + amount, 1);
      return toDateString(next);
    });
  };
  const goToToday = () => setMonthDate(TODAY.slice(0, 8) + '01');

  const completeTask = (task: CalendarTask) => {
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setCompletedCount((count) => count + 1);
    setStatusMessage(`「${task.name}」を完了しました`);
  };

  const passTask = (task: CalendarTask) => {
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setStatusMessage(`「${task.name}」をパスしました`);
  };

  return (
    <div className="screen-content calendar-page" data-uilab-component="Calendar.Page">
      <header className="calendar-header" data-uilab-component="Calendar.Header">
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
          <button type="button" className="calendar-today-button" onClick={goToToday}>
            今日
          </button>
        </div>
      </header>

      <section
        className={`calendar-month-grid calendar-month-grid--${monthDays.length / 7}`}
        aria-label={`${formatMonthLabel(monthDate)}のカレンダー`}
        data-uilab-component="Calendar.MonthGrid"
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
            const displayedTasks = dayTasks.slice(0, MAX_CELL_TASKS);
            const moreCount = dayTasks.length - displayedTasks.length;

            return (
              <div
                key={day.date}
                className={`calendar-day-cell${day.isCurrentMonth ? '' : ' is-outside-month'}`}
                data-uilab-component="Calendar.DayCell"
                data-uilab-id={day.date}
                role="button"
                tabIndex={0}
                aria-label={`${formatDateLabel(day.date)}${dayTasks.length ? `、タスク${dayTasks.length}件` : ''}`}
                onClick={() => openDate(day.date)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openDate(day.date);
                  }
                }}
              >
                <span
                  className={`calendar-day-number calendar-day-number--${day.weekday}${day.date === TODAY ? ' is-today' : ''}`}
                  data-uilab-component="Calendar.DayCell.Date"
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
                      onClick={(event) => {
                        event.stopPropagation();
                        openDate(day.date);
                      }}
                    >
                      +{moreCount}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="calendar-status" role="status" aria-live="polite">
        {statusMessage}
      </p>

      <CalendarDateSheet
        completedCount={completedCount}
        date={selectedDate}
        tasks={visibleTasks}
        onClose={() => setSelectedDate(null)}
        onComplete={completeTask}
        onPass={passTask}
        onNavigate={openDate}
      />
    </div>
  );
}

function CalendarDateSheet({
  completedCount,
  date,
  onClose,
  onComplete,
  onNavigate,
  onPass,
  tasks,
}: {
  completedCount: number;
  date: string | null;
  onClose: () => void;
  onComplete: (task: CalendarTask) => void;
  onNavigate: (date: string) => void;
  onPass: (task: CalendarTask) => void;
  tasks: CalendarTask[];
}) {
  const startX = useRef<number | null>(null);
  const directTasks = date ? tasks.filter((task) => task.date === date) : [];
  const periodTasks = date
    ? tasks.filter(
        (task) =>
          task.date !== date &&
          task.periodStart &&
          task.periodEnd &&
          task.periodStart <= date &&
          date <= task.periodEnd,
      )
    : [];

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
          <h2 id="calendar-date-sheet-title" data-uilab-component="Calendar.DateSheet.Date">
            {formatDateLabel(date)}
          </h2>
          <DateSection
            label="この日"
            tasks={directTasks}
            component="Calendar.DateSheet.TodaySection"
            onComplete={onComplete}
            onPass={onPass}
          />
          <DateSection
            label="期間中"
            tasks={periodTasks}
            component="Calendar.DateSheet.PeriodSection"
            onComplete={onComplete}
            onPass={onPass}
          />
          <section className="calendar-completed-section" data-uilab-component="Calendar.DateSheet.CompletedSection">
            <button type="button" className="calendar-completed-section__toggle" aria-expanded="false">
              <span>完了済み {completedCount}件</span>
              <ChevronRight aria-hidden="true" />
            </button>
          </section>
        </div>
      </section>
    </div>
  );
}

function DateSection({
  component,
  label,
  onComplete,
  onPass,
  tasks,
}: {
  component: string;
  label: string;
  onComplete: (task: CalendarTask) => void;
  onPass: (task: CalendarTask) => void;
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
  onComplete,
  onPass,
  task,
}: {
  onComplete: () => void;
  onPass: () => void;
  task: CalendarTask;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const startX = useRef<number | null>(null);

  return (
    <div
      className={`calendar-detail-task${actionsOpen ? ' is-actions-open' : ''}`}
      data-uilab-id={task.id}
      onPointerDown={(event) => {
        event.stopPropagation();
        startX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (startX.current !== null && startX.current - event.clientX > 48) {
          setActionsOpen(true);
        }
        startX.current = null;
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
        onClick={() => setActionsOpen((open) => !open)}
      >
        …
      </button>
      {actionsOpen ? (
        <div className="calendar-detail-task__actions" aria-label={`${task.name}の操作メニュー`}>
          <button type="button" onClick={() => setActionsOpen(false)}>
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

  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0, 12);
  const weekCount = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7);

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
