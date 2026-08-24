import { Check, ChevronRight, Ellipsis, House } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  homeFixtures,
  haru,
  type CompletedTask,
  type HomeFixture,
  type HomePerson,
  type HomeTask,
  type HomeUiLabState,
  type PassedTask,
} from '../fixtures/home';
import { getHomeUiLabState } from '../mock/homeState';
import { MOCK_TODAY } from '../mock/constants';
import { shoppingFixtures, type ShoppingFixture } from '../fixtures/shopping';

type HomePageProps = {
  state?: HomeUiLabState;
  session?: HomeFixture;
  shoppingFixture?: ShoppingFixture;
  onSessionChange?: (fixture: HomeFixture) => void;
};

const COMPLETION_DURATION_MS = 180;

export function HomePage({ state = getHomeUiLabState(), session, shoppingFixture = shoppingFixtures.normal, onSessionChange }: HomePageProps) {
  const fixture = session ?? homeFixtures[state];
  const [activeTasks, setActiveTasks] = useState<HomeTask[]>(() => fixture.activeTasks);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(() => fixture.completedTasks);
  const [passedTasks, setPassedTasks] = useState<PassedTask[]>(() => fixture.passedTasks);
  const [completingIds, setCompletingIds] = useState<Set<string>>(() => new Set());
  const [completedOpen, setCompletedOpen] = useState(() => fixture.initialCompletedOpen ?? false);
  const [passedOpen, setPassedOpen] = useState(() => fixture.initialPassedOpen ?? false);
  const [statusMessage, setStatusMessage] = useState('');
  const completionTimers = useRef<number[]>([]);

  useEffect(() => () => completionTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const commit = (next: HomeFixture) => {
    setActiveTasks(next.activeTasks);
    setCompletedTasks(next.completedTasks);
    setPassedTasks(next.passedTasks);
    onSessionChange?.(next);
  };

  const completeTask = (task: HomeTask) => {
    setCompletingIds((current) => {
      if (current.has(task.id)) return current;
      const next = new Set(current);
      next.add(task.id);
      return next;
    });

    const timer = window.setTimeout(() => {
      const record: CompletedTask = {
        id: `completed-${task.id}`,
        taskId: task.id,
        name: task.name,
        task: {
          ...task,
          completionHistory: [
            ...(task.completionHistory ?? []).filter((entry) => !(entry.date === MOCK_TODAY && entry.outcome === 'completed')),
            { date: MOCK_TODAY, outcome: 'completed' },
          ],
        },
        completedBy: haru,
      };
      const next = {
        ...fixture,
        activeTasks: activeTasks.filter((item) => item.id !== task.id),
        completedTasks: [record, ...completedTasks],
        passedTasks,
      };
      commit(next);
      setCompletingIds((current) => {
        const nextIds = new Set(current);
        nextIds.delete(task.id);
        return nextIds;
      });
    }, COMPLETION_DURATION_MS);

    completionTimers.current.push(timer);
  };

  const passTask = (task: HomeTask) => {
    const record: PassedTask = {
      id: `passed-${task.id}`,
      taskId: task.id,
      name: task.name,
      task: { ...task },
      assignee: task.assignee,
    };
    commit({
      ...fixture,
      activeTasks: activeTasks.filter((item) => item.id !== task.id),
      completedTasks,
      passedTasks: [record, ...passedTasks],
    });
    setStatusMessage(`「${task.name}」をパスしました`);
  };

  const restoreCompleted = (record: CompletedTask) => {
    commit({
      ...fixture,
      activeTasks: [removeTodayCompletion(record.task), ...activeTasks],
      completedTasks: completedTasks.filter((item) => item.id !== record.id),
      passedTasks,
    });
    setStatusMessage(`「${record.name}」を戻しました`);
  };

  const restorePassed = (record: PassedTask) => {
    commit({
      ...fixture,
      activeTasks: [record.task, ...activeTasks],
      completedTasks,
      passedTasks: passedTasks.filter((item) => item.id !== record.id),
    });
    setStatusMessage(`「${record.name}」を戻しました`);
  };

  const navigateToEdit = (taskId: string) => {
    window.location.hash = `#/tasks/edit?homeState=${encodeURIComponent(state)}&taskId=${encodeURIComponent(taskId)}`;
  };

  const initialActions = fixture.initialActions;

  return (
    <div className="screen-content home-page" data-uilab-component="Home.Page" data-uilab-id="home-page">
      <header className="home-header" data-uilab-component="Home.Header" data-uilab-id="home-header">
        <p className="home-date" data-uilab-component="Home.Date" data-uilab-id="home-date">8月20日 木曜日</p>
        <h1 data-uilab-component="Home.SectionHeading" data-uilab-id="home-section-heading">やること</h1>
      </header>

      {activeTasks.length > 0 ? (
        <section className="home-task-list" aria-label="やること一覧" data-uilab-component="Home.TaskList" data-uilab-id="home-task-list">
          {activeTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              completing={completingIds.has(task.id)}
              onComplete={() => completeTask(task)}
              onPass={() => passTask(task)}
              onEdit={() => navigateToEdit(task.id)}
            />
          ))}
        </section>
      ) : (
        <section className="home-empty-state" aria-label="やることなし">
          <div className="home-empty-state__illustration" aria-hidden="true"><House /><Check /></div>
          <p>やることはありません</p>
        </section>
      )}

      {completedTasks.length > 0 ? (
        <section className="home-history home-completed" data-uilab-component="Home.CompletedSection" data-uilab-id="home-completed-section">
          <button type="button" className="home-history__toggle home-completed__toggle" aria-expanded={completedOpen} data-uilab-component="Home.CompletedToggle" data-uilab-id="home-completed-toggle" onClick={() => setCompletedOpen((open) => !open)}>
            <span>完了済み {completedTasks.length}</span><ChevronRight aria-hidden="true" className={completedOpen ? 'is-open' : ''} />
          </button>
          {completedOpen ? (
            <div className="home-history__list home-completed__list">
              {completedTasks.map((task) => <CompletedRow key={task.id} task={task} initialOpen={initialActions?.section === 'completed' && initialActions.taskId === task.taskId} onEdit={() => navigateToEdit(task.taskId)} onRestore={() => restoreCompleted(task)} />)}
            </div>
          ) : null}
        </section>
      ) : null}

      {passedTasks.length > 0 ? (
        <section className="home-history home-passed" data-uilab-component="Home.PassedSection" data-uilab-id="home-passed-section">
          <button type="button" className="home-history__toggle home-passed__toggle" aria-expanded={passedOpen} data-uilab-component="Home.PassedToggle" data-uilab-id="home-passed-toggle" onClick={() => setPassedOpen((open) => !open)}>
            <span>パス済み {passedTasks.length}</span><ChevronRight aria-hidden="true" className={passedOpen ? 'is-open' : ''} />
          </button>
          {passedOpen ? (
            <div className="home-history__list home-passed__list">
              {passedTasks.map((task) => <PassedRow key={task.id} task={task} initialOpen={initialActions?.section === 'passed' && initialActions.taskId === task.taskId} onEdit={() => navigateToEdit(task.taskId)} onRestore={() => restorePassed(task)} />)}
            </div>
          ) : null}
        </section>
      ) : null}

      <a className="home-shopping-summary" href="#/shopping" data-uilab-component="Home.ShoppingSummary" data-uilab-id="home-shopping-summary">
        <span>買い物 {shoppingFixture.activeItems.length}件</span><ChevronRight aria-hidden="true" />
      </a>
      <p className="home-status" role="status" aria-live="polite">{statusMessage}</p>
    </div>
  );
}

function removeTodayCompletion(task: HomeTask): HomeTask {
  return {
    ...task,
    completionHistory: task.completionHistory?.filter((entry) => !(entry.date === MOCK_TODAY && entry.outcome === 'completed')),
  };
}

function TaskRow({ completing, onComplete, onEdit, onPass, task }: { completing: boolean; onComplete: () => void; onEdit: () => void; onPass: () => void; task: HomeTask }) {
  const { actionsOpen, handleClickCapture, handlePointerCancel, handlePointerDown, handlePointerUp, setActionsOpen } = useHomeRowActions();
  return (
    <div className={`home-task-row${actionsOpen ? ' is-actions-open' : ''}`} data-uilab-component="Home.TaskRow" data-uilab-id={task.id} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel} onClickCapture={handleClickCapture}>
      <div className="home-task-row__content">
        <button type="button" className="home-task-row__main" onClick={onComplete} aria-label={`${task.name}を完了`} disabled={completing}>
          <span className={`task-check task-check--${task.timeScope}${task.overdue ? ' is-overdue' : ''}${completing ? ' is-completing' : ''}`} data-task-scope={task.overdue ? 'overdue' : task.timeScope} data-uilab-component="Home.TaskRow.Check" data-uilab-id={`home-task-${task.id}-check`} aria-hidden="true">{completing ? <Check /> : null}</span>
          <span className="home-task-row__details">
            <span className="home-task-row__name" data-uilab-component="Home.TaskRow.Name" data-uilab-id={`home-task-${task.id}-name`}>{task.name}</span>
            <span className="home-task-row__deadline" data-uilab-component="Home.TaskRow.Deadline" data-uilab-id={`home-task-${task.id}-deadline`}>{task.deadlineText}</span>
          </span>
          {task.assignee ? <Avatar person={task.assignee} label="担当" /> : null}
        </button>
        <button type="button" className="home-task-row__more" aria-label={`${task.name}の操作`} aria-expanded={actionsOpen} data-uilab-component="Home.TaskRow.MoreButton" data-uilab-id={`home-task-${task.id}-more`} onClick={() => setActionsOpen((open) => !open)}><Ellipsis aria-hidden="true" /></button>
      </div>
      {actionsOpen ? <div className="home-task-row__actions" aria-label={`${task.name}の操作メニュー`}><span className="home-task-row__actions-spacer" aria-hidden="true" /><button type="button" onClick={onEdit}>編集</button><button type="button" className="is-pass" onClick={onPass}>パス</button></div> : null}
    </div>
  );
}

function CompletedRow({ initialOpen, onEdit, onRestore, task }: { initialOpen: boolean; onEdit: () => void; onRestore: () => void; task: CompletedTask }) {
  return <HistoryRow initialOpen={initialOpen} onEdit={onEdit} onRestore={onRestore} task={task} section="completed" />;
}

function PassedRow({ initialOpen, onEdit, onRestore, task }: { initialOpen: boolean; onEdit: () => void; onRestore: () => void; task: PassedTask }) {
  return <HistoryRow initialOpen={initialOpen} onEdit={onEdit} onRestore={onRestore} task={task} section="passed" />;
}

function HistoryRow({ initialOpen, onEdit, onRestore, task, section }: { initialOpen: boolean; onEdit: () => void; onRestore: () => void; task: CompletedTask | PassedTask; section: 'completed' | 'passed' }) {
  const { actionsOpen, handleClickCapture, handlePointerCancel, handlePointerDown, handlePointerUp, setActionsOpen } = useHomeRowActions(initialOpen);
  const isDeleted = task.deleted === true;
  return (
    <div className={`home-task-row home-history-row home-task-row--${section}${isDeleted ? ' is-deleted' : ''}${actionsOpen ? ' is-actions-open' : ''}`} data-uilab-component={section === 'completed' ? 'Home.CompletedRow' : 'Home.PassedRow'} data-uilab-id={task.id} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel} onClickCapture={handleClickCapture}>
      <div className="home-task-row__content">
        <div className="home-history-row__main">
          <span className="home-task-row__details"><span className="home-task-row__name">{task.name}</span></span>
          {section === 'completed' && (task as CompletedTask).completedBy ? <Avatar person={(task as CompletedTask).completedBy} label="完了者" /> : null}
          {section === 'passed' && (task as PassedTask).assignee ? <Avatar person={(task as PassedTask).assignee} label="担当" /> : null}
        </div>
        <button type="button" className="home-task-row__more" aria-label={`${task.name}の操作`} aria-expanded={actionsOpen} data-uilab-component={section === 'completed' ? 'Home.CompletedRow.MoreButton' : 'Home.PassedRow.MoreButton'} data-uilab-id={`${task.id}-more`} onClick={() => setActionsOpen((open) => !open)}><Ellipsis aria-hidden="true" /></button>
      </div>
      {actionsOpen ? <div className={`home-task-row__actions${isDeleted ? ' home-task-row__actions--restore-only' : ''}`} aria-label={`${task.name}の操作メニュー`}><span className="home-task-row__actions-spacer" aria-hidden="true" />{!isDeleted ? <button type="button" data-uilab-component={section === 'completed' ? 'Home.CompletedRow.Edit' : 'Home.PassedRow.Edit'} data-uilab-id={`${task.id}-edit`} onClick={onEdit}>編集</button> : null}<button type="button" className="is-restore" data-uilab-component={section === 'completed' ? 'Home.CompletedRow.Restore' : 'Home.PassedRow.Restore'} data-uilab-id={`${task.id}-restore`} onClick={onRestore}>戻す</button></div> : null}
    </div>
  );
}

function useHomeRowActions(initialOpen = false) {
  const [actionsOpen, setActionsOpen] = useState(initialOpen);
  const startX = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => { startX.current = event.clientX; };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const distance = startX.current - event.clientX;
    startX.current = null;
    if (distance > 48) { suppressClick.current = true; setActionsOpen(true); }
  };
  const handlePointerCancel = () => { startX.current = null; };
  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    if (event.target instanceof Element && event.target.closest('.home-task-row__actions')) { suppressClick.current = false; return; }
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  };
  return { actionsOpen, handleClickCapture, handlePointerCancel, handlePointerDown, handlePointerUp, setActionsOpen };
}

function Avatar({ person, label }: { person: HomePerson | undefined; label: string }) {
  if (!person) return null;
  return <span className="home-avatar" role="img" aria-label={`${label}: ${person.name}`} data-uilab-component="Home.TaskRow.Avatar">{person.initials}</span>;
}
