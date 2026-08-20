import { Check, ChevronRight, Ellipsis, House } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { homeFixtures, type CompletedTask, type HomeTask, type HomeUiLabState } from '../fixtures/home';
import { getHomeUiLabState } from '../mock/homeState';

type HomePageProps = {
  state?: HomeUiLabState;
};

const COMPLETION_DURATION_MS = 180;

export function HomePage({ state = getHomeUiLabState() }: HomePageProps) {
  const fixture = homeFixtures[state];
  const [activeTasks, setActiveTasks] = useState<HomeTask[]>(fixture.activeTasks);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(
    fixture.completedTasks,
  );
  const [completingIds, setCompletingIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [completedOpen, setCompletedOpen] = useState(state === 'completed-open');
  const [statusMessage, setStatusMessage] = useState('');
  const completionTimers = useRef<number[]>([]);

  useEffect(() => {
    setActiveTasks(fixture.activeTasks);
    setCompletedTasks(fixture.completedTasks);
    setCompletingIds(new Set());
    setCompletedOpen(state === 'completed-open');
    setStatusMessage('');
  }, [fixture, state]);

  useEffect(() => {
    return () => completionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const completeTask = (task: HomeTask) => {
    setCompletingIds((current) => {
      if (current.has(task.id)) return current;
      const next = new Set(current);
      next.add(task.id);
      return next;
    });

    const timer = window.setTimeout(() => {
      setActiveTasks((current) => current.filter((item) => item.id !== task.id));
      setCompletedTasks((current) => [
        {
          id: `completed-${task.id}`,
          name: task.name,
          completedAt: 'たった今',
          completedBy: task.assignee,
        },
        ...current,
      ]);
      setCompletingIds((current) => {
        const next = new Set(current);
        next.delete(task.id);
        return next;
      });
    }, COMPLETION_DURATION_MS);

    completionTimers.current.push(timer);
  };

  const passTask = (task: HomeTask) => {
    setActiveTasks((current) => current.filter((item) => item.id !== task.id));
    setStatusMessage(`「${task.name}」をパスしました`);
  };

  return (
    <div className="screen-content home-page" data-uilab-component="Home.Page">
      <header className="home-header">
        <p className="home-date" data-uilab-component="Home.Date">
          8月20日 木曜日
        </p>
        <h1 data-uilab-component="Home.SectionHeading">やること</h1>
      </header>

      {activeTasks.length > 0 ? (
        <section
          className="home-task-list"
          aria-label="やること一覧"
          data-uilab-component="Home.TaskList"
        >
          {activeTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              completing={completingIds.has(task.id)}
              onComplete={() => completeTask(task)}
              onPass={() => passTask(task)}
              onEdit={() => setStatusMessage('編集はこのモックでは表示のみです')}
            />
          ))}
        </section>
      ) : (
        <section className="home-empty-state" aria-label="やることなし">
          <div className="home-empty-state__illustration" aria-hidden="true">
            <House />
            <Check />
          </div>
          <p>やることはありません</p>
        </section>
      )}

      <section className="home-completed" data-uilab-component="Home.CompletedSection">
        <button
          type="button"
          className="home-completed__toggle"
          aria-expanded={completedOpen}
          onClick={() => setCompletedOpen((open) => !open)}
        >
          <span>完了済み {completedTasks.length}件</span>
          <ChevronRight aria-hidden="true" className={completedOpen ? 'is-open' : ''} />
        </button>
        {completedOpen && completedTasks.length > 0 ? (
          <div className="home-completed__list">
            {completedTasks.map((task) => (
              <CompletedRow key={task.id} task={task} />
            ))}
          </div>
        ) : null}
      </section>

      <a
        className="home-shopping-summary"
        href="#/shopping"
        data-uilab-component="Home.ShoppingSummary"
      >
        <span>買い物 {fixture.shoppingCount}件</span>
        <ChevronRight aria-hidden="true" />
      </a>

      <p className="home-status" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

function TaskRow({
  completing,
  onComplete,
  onEdit,
  onPass,
  task,
}: {
  completing: boolean;
  onComplete: () => void;
  onEdit: () => void;
  onPass: () => void;
  task: HomeTask;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const startX = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const distance = startX.current - event.clientX;
    startX.current = null;
    if (distance > 48) {
      suppressClick.current = true;
      setActionsOpen(true);
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    if (
      event.target instanceof Element &&
      event.target.closest('.home-task-row__actions')
    ) {
      suppressClick.current = false;
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  };

  return (
    <div
      className={`home-task-row${actionsOpen ? ' is-actions-open' : ''}`}
      data-uilab-component="Home.TaskRow"
      data-uilab-id={task.id}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        startX.current = null;
      }}
      onClickCapture={handleClickCapture}
    >
      <div className="home-task-row__content">
        <button
          type="button"
          className="home-task-row__main"
          onClick={onComplete}
          aria-label={`${task.name}を完了`}
          disabled={completing}
        >
          <span
            className={`task-check task-check--${task.timeScope}${task.overdue ? ' is-overdue' : ''}${completing ? ' is-completing' : ''}`}
            data-task-scope={task.overdue ? 'overdue' : task.timeScope}
            aria-hidden="true"
          >
            {completing ? <Check /> : null}
          </span>
          <span className="home-task-row__details">
            <span className="home-task-row__name" data-uilab-component="Home.TaskRow.Name">
              {task.name}
            </span>
            <span
              className="home-task-row__deadline"
              data-uilab-component="Home.TaskRow.Deadline"
            >
              {task.deadlineText}
            </span>
          </span>
          {task.assignee ? <Avatar person={task.assignee} label="担当" /> : null}
        </button>
        <button
          type="button"
          className="home-task-row__more"
          aria-label={`${task.name}の操作`}
          aria-expanded={actionsOpen}
          onClick={() => setActionsOpen((open) => !open)}
        >
          <Ellipsis aria-hidden="true" />
        </button>
      </div>
      {actionsOpen ? (
        <div className="home-task-row__actions" aria-label={`${task.name}の操作メニュー`}>
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

function CompletedRow({ task }: { task: CompletedTask }) {
  return (
    <div className="home-completed__row">
      <div>
        <p>{task.name}</p>
        <span>{task.completedAt}</span>
      </div>
      {task.completedBy ? <Avatar person={task.completedBy} label="完了者" /> : null}
    </div>
  );
}

function Avatar({ person, label }: { person: HomeTask['assignee']; label: string }) {
  if (!person) return null;

  return (
    <span
      className="home-avatar"
      role="img"
      aria-label={`${label}: ${person.name}`}
      data-uilab-component="Home.TaskRow.Avatar"
    >
      {person.initials}
    </span>
  );
}
