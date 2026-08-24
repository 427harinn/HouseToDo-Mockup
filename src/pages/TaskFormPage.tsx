import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';
import type { HomeTask, HomeTaskRepeat } from '../fixtures/home';
import { formatTaskHistoryDate, getLastCompletedDate } from '../mock/taskHistory';
import { MOCK_TODAY } from '../mock/constants';

type RepeatOption = HomeTaskRepeat;

type Sheet = 'repeat' | 'assignee' | 'reuse' | 'delete' | null;

type Member = { id: string; name: string; initials: string };

type TaskFormState = {
  name: string;
  repeat: RepeatOption;
  weekdays: string[];
  monthDay: string;
  startDate: string;
  allDay: boolean;
  date: string;
  time: string;
  notification: string;
  assignee: Member | null;
  memo: string;
};

const MEMBERS: Member[] = [
  { id: 'yuki', name: 'ゆき', initials: 'ゆ' },
  { id: 'haru', name: 'はる', initials: 'は' },
];
const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'];
const REPEAT_OPTIONS: RepeatOption[] = [
  '今回だけ',
  '毎日',
  '曜日を決める',
  '毎月○日',
  '今週のどこか',
  '今月のどこか',
];

const TASK_REUSE_ITEMS: Array<{
  id: string;
  name: string;
  repeat: RepeatOption;
  weekdays?: string[];
  monthDay?: string;
  allDay: boolean;
  time: string;
  notification: string;
  assignee: Member | null;
  memo: string;
}> = [
  { id: 'bird', name: 'インコの餌交換', repeat: '毎日', allDay: true, time: '08:00', notification: 'なし', assignee: null, memo: '朝の餌と水を取り替える。' },
  { id: 'trash', name: 'ゴミ出し', repeat: '曜日を決める', weekdays: ['火', '金'], allDay: false, time: '08:00', notification: '10分前', assignee: MEMBERS[0], memo: '収集日の朝に玄関前へ出す。' },
  { id: 'toilet', name: 'トイレ掃除', repeat: '今週のどこか', allDay: true, time: '19:00', notification: 'なし', assignee: null, memo: '床と便座を拭く。' },
];

const taskEditFixtures: Record<string, HomeTask> = {
  'previous-completed': {
    id: 'task-edit-previous-completed',
    name: 'キッチンの拭き掃除',
    deadlineText: '今週のどこか',
    timeScope: 'week',
    repeat: '今週のどこか',
    startDate: '2026-07-10',
    allDay: true,
    date: '2026-08-20',
    memo: '汚れが気になる場所を中心に。',
    completionHistory: [
      { date: '2026-08-12', outcome: 'completed' },
      { date: '2026-08-20', outcome: 'completed' },
    ],
  },
  'previous-none': {
    id: 'task-edit-previous-none',
    name: '季節の寝具を入れ替える',
    deadlineText: '8/31まで',
    timeScope: 'month',
    repeat: '今回だけ',
    startDate: '2026-08-20',
    allDay: true,
    date: '2026-08-31',
    memo: '',
  },
  'previous-passed-only': {
    id: 'task-edit-previous-passed-only',
    name: '布団を干す',
    deadlineText: '今日中',
    timeScope: 'date',
    repeat: '毎日',
    completionHistory: [{ date: '2026-08-19', outcome: 'passed' }],
  },
};

const stateNames = [
  'normal',
  'repeat-sheet',
  'weekday-repeat',
  'time-specific',
  'assignee-sheet',
  'reuse-picker',
  'reuse-selected',
  'long-text',
  'previous-completed',
  'previous-none',
  'previous-passed-only',
];

type TaskFormPageProps = {
  isEdit: boolean;
  state: string;
  initialTask?: HomeTask;
  onTaskSave?: (task: { name: string; assignee?: HomeTask['assignee'] }) => void;
  onTaskDelete?: () => void;
  homeState?: string;
  returnHash?: string;
};

export function TaskFormPage({ isEdit, state, initialTask, onTaskSave, onTaskDelete, homeState, returnHash }: TaskFormPageProps) {
  const safeState = stateNames.includes(state) ? state : 'normal';
  const editDeleteConfirm = isEdit && state === 'delete-confirm';
  const taskForForm = initialTask ?? (isEdit ? taskEditFixtures[safeState] : undefined);
  const initialReuse = safeState === 'reuse-selected' ? TASK_REUSE_ITEMS.find((item) => item.id === 'trash') ?? null : null;
  const lastCompletedDate = isEdit && taskForForm ? getLastCompletedDate(taskForForm) : undefined;
  const [form, setForm] = useState<TaskFormState>(() => ({
    name:
      safeState === 'long-text'
        ? '冷蔵庫の中を確認して足りない食材を買い物メモに追加する'
        : initialReuse?.name ?? taskForForm?.name ?? (isEdit ? 'キッチンの拭き掃除' : 'ゴミ出し'),
    repeat: safeState === 'weekday-repeat' ? '曜日を決める' : initialReuse?.repeat ?? taskForForm?.repeat ?? (isEdit ? '今週のどこか' : '毎日'),
    weekdays: safeState === 'weekday-repeat' ? ['火', '金'] : initialReuse?.weekdays ?? taskForForm?.weekdays ?? [],
    monthDay: taskForForm?.monthDay ?? '20',
    startDate: initialReuse ? MOCK_TODAY : taskForForm?.startDate ?? MOCK_TODAY,
    allDay: initialReuse?.allDay ?? (taskForForm?.allDay ?? safeState !== 'time-specific'),
    date: initialReuse ? MOCK_TODAY : taskForForm?.date ?? MOCK_TODAY,
    time: initialReuse?.time ?? taskForForm?.time ?? '19:00',
    notification: initialReuse?.notification ?? taskForForm?.notification ?? '10分前',
    assignee: initialReuse?.assignee ?? taskForForm?.assignee ?? (isEdit ? MEMBERS[1] : null),
    memo:
      safeState === 'long-text'
        ? '週末に家族で確認し、足りないものを買い物リストへ追加する。終わったら冷蔵庫の棚も軽く整える。'
        : initialReuse?.memo ?? taskForForm?.memo ?? (isEdit ? '汚れが気になる場所を中心に。' : ''),
  }));
  const [sheet, setSheet] = useState<Sheet>(() => {
    if (editDeleteConfirm) return 'delete';
    if (safeState === 'repeat-sheet') return 'repeat';
    if (safeState === 'assignee-sheet') return 'assignee';
    if (safeState === 'reuse-picker') return 'reuse';
    return null;
  });
  const [reuseQuery, setReuseQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const filteredReuse = useMemo(
    () => TASK_REUSE_ITEMS.filter((item) => `${item.name}${repeatSummary(item)}`.includes(reuseQuery)),
    [reuseQuery],
  );

  const update = <K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const chooseRepeat = (repeat: RepeatOption) => {
    update('repeat', repeat);
    if (repeat === '曜日を決める' || repeat === '毎月○日') return;
    setSheet(null);
  };

  const toggleWeekday = (weekday: string) => {
    setForm((current) => ({
      ...current,
      weekdays: current.weekdays.includes(weekday) ? current.weekdays.filter((item) => item !== weekday) : [...current.weekdays, weekday],
    }));
  };

  const selectReuse = (item: (typeof TASK_REUSE_ITEMS)[number]) => {
    setForm((current) => ({
      ...current,
      name: item.name,
      repeat: item.repeat,
      weekdays: item.weekdays ?? [],
      monthDay: item.monthDay ?? '20',
      allDay: item.allDay,
      time: item.time,
      notification: item.notification,
      assignee: item.assignee,
      memo: item.memo,
    }));
    setSheet(null);
    setStatusMessage('以前の項目を反映しました');
  };

  return (
    <div className="screen-content form-page task-form-page" data-uilab-component="TaskForm.Page" data-uilab-id="task-form-page">
      <header className="form-page__header">
        <button type="button" className="form-page__back" aria-label="戻る" onClick={() => { window.location.hash = returnHash ?? (homeState ? `#/home?uilabState=${encodeURIComponent(homeState)}` : '#/home'); }}>
          <ChevronLeft aria-hidden="true" />
          <span>戻る</span>
        </button>
        <h1>{isEdit ? '家事を編集' : '家事を追加'}</h1>
      </header>

      {lastCompletedDate ? (
        <p className="task-form__last-completed" data-uilab-component="TaskForm.LastCompleted" data-uilab-id="task-form-last-completed">
          前回：{formatTaskHistoryDate(lastCompletedDate)}
        </p>
      ) : null}

      {!isEdit ? (
        <button type="button" className="form-reuse-trigger" data-uilab-component="TaskForm.ReusePickerTrigger" data-uilab-id="task-form-reuse-trigger" onClick={() => setSheet('reuse')}>
          <span>以前の項目から選ぶ</span><ChevronRight aria-hidden="true" />
        </button>
      ) : null}

      <form className="form-layout" onSubmit={(event) => { event.preventDefault(); onTaskSave?.({ name: form.name, assignee: form.assignee ?? undefined }); setStatusMessage('保存しました'); }}>
        <label className="form-control" data-uilab-component="TaskForm.Name" data-uilab-id="task-form-name">
          <span>家事名</span>
          <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="家事名を入力" required />
        </label>

        <div className="form-row" data-uilab-component="TaskForm.Repeat" data-uilab-id="task-form-repeat">
          <span className="form-row__label">繰り返し</span>
          <span className="form-row__current"><span>{repeatSummary(form)}</span><ChevronRight aria-hidden="true" /></span>
          <button type="button" className="form-row__value" aria-label={`繰り返し: ${repeatSummary(form)}`} onClick={() => setSheet('repeat')} />
        </div>
        <label className="form-control" data-uilab-component="TaskForm.StartDate" data-uilab-id="task-form-start-date">
          <span>開始日</span><input type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} />
        </label>
        <label className="form-toggle" data-uilab-component="TaskForm.AllDay" data-uilab-id="task-form-all-day">
          <span>終日</span><input aria-label="終日" type="checkbox" checked={form.allDay} onChange={(event) => update('allDay', event.target.checked)} /><span className="form-toggle__current">{form.allDay ? 'オン' : 'オフ'}</span><span className="form-toggle__visual" aria-hidden="true" />
        </label>
        <div className={`form-datetime-grid${form.allDay ? ' form-datetime-grid--all-day' : ''}`}>
          <label className="form-control" data-uilab-component="TaskForm.Date" data-uilab-id="task-form-date">
            <span>日付</span><input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
          </label>
          {!form.allDay ? (
            <label className="form-control" data-uilab-component="TaskForm.Time" data-uilab-id="task-form-time">
              <span>時刻</span><input type="time" value={form.time} onChange={(event) => update('time', event.target.value)} />
            </label>
          ) : null}
        </div>
        {!form.allDay ? (
          <label className="form-control form-control--compact-field" data-uilab-component="TaskForm.Notification" data-uilab-id="task-form-notification">
            <span>通知</span><select value={form.notification} onChange={(event) => update('notification', event.target.value)}><option>なし</option><option>時刻ちょうど</option><option>10分前</option><option>30分前</option></select>
          </label>
        ) : null}

        <div className="form-row" data-uilab-component="TaskForm.Assignee" data-uilab-id="task-form-assignee">
          <span className="form-row__label">担当</span>
          <span className="form-row__current"><span className="form-row__person">{form.assignee ? <span className="form-avatar" role="img" aria-label={`担当: ${form.assignee.name}`}>{form.assignee.initials}</span> : null}{form.assignee?.name ?? '誰でも'}</span><ChevronRight aria-hidden="true" /></span>
          <button type="button" className="form-row__value" aria-label={`担当: ${form.assignee?.name ?? '誰でも'}`} onClick={() => setSheet('assignee')} />
        </div>
        <label className="form-control" data-uilab-component="TaskForm.Memo" data-uilab-id="task-form-memo">
          <span>メモ</span><textarea rows={2} value={form.memo} onChange={(event) => update('memo', event.target.value)} placeholder="メモを入力" />
        </label>

        <div className={`form-actions${isEdit ? ' form-actions--edit' : ''}`}>
          <button type="submit" className="form-save" data-uilab-component="TaskForm.Save" data-uilab-id="task-form-save">保存</button>
          {isEdit ? <button type="button" className="form-delete" data-uilab-component="TaskForm.Delete" data-uilab-id="task-form-delete" onClick={() => setSheet('delete')}>この家事を削除</button> : null}
        </div>
      </form>
      <p className="form-status" role="status" aria-live="polite">{statusMessage}</p>

      <BottomSheet open={sheet === 'repeat'} title="繰り返し" onClose={() => setSheet(null)}>
        <div className="selection-list" data-uilab-component="TaskForm.RepeatSheet" data-uilab-id="task-repeat-sheet">
          {REPEAT_OPTIONS.map((option) => <button key={option} type="button" className="selection-list__row" onClick={() => chooseRepeat(option)}><span>{option}</span>{form.repeat === option ? <Check aria-hidden="true" /> : null}</button>)}
          {form.repeat === '曜日を決める' ? (
            <div className="repeat-sheet__detail" data-uilab-component="TaskForm.WeekdayRepeat" data-uilab-id="task-repeat-weekday-detail">
              <span className="repeat-sheet__detail-label">曜日を選択</span>
              <div className="weekday-control__options">
                {WEEKDAYS.map((weekday) => <button key={weekday} type="button" className={`weekday-button${form.weekdays.includes(weekday) ? ' is-selected' : ''}`} aria-pressed={form.weekdays.includes(weekday)} onClick={() => toggleWeekday(weekday)}>{weekday}</button>)}
              </div>
              <button type="button" className="form-save repeat-sheet__confirm" disabled={form.weekdays.length === 0} onClick={() => setSheet(null)}>決定</button>
            </div>
          ) : null}
          {form.repeat === '毎月○日' ? (
            <div className="repeat-sheet__detail" data-uilab-component="TaskForm.MonthDay" data-uilab-id="task-repeat-month-day-detail">
              <label className="form-control form-control--compact-field"><span>毎月の日</span><input type="number" min="1" max="31" value={form.monthDay} onChange={(event) => update('monthDay', event.target.value)} /></label>
              <button type="button" className="form-save repeat-sheet__confirm" onClick={() => setSheet(null)}>決定</button>
            </div>
          ) : null}
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === 'assignee'} title="担当" onClose={() => setSheet(null)}>
        <div className="selection-list" data-uilab-component="TaskForm.AssigneeSheet" data-uilab-id="task-assignee-sheet">
          <button type="button" className="selection-list__row" onClick={() => { update('assignee', null); setSheet(null); }}><span>誰でも</span>{!form.assignee ? <Check aria-hidden="true" /> : null}</button>
          {MEMBERS.map((member) => <button key={member.id} type="button" className="selection-list__row" onClick={() => { update('assignee', member); setSheet(null); }}><span className="form-row__person"><span className="form-avatar" aria-hidden="true">{member.initials}</span>{member.name}</span>{form.assignee?.id === member.id ? <Check aria-hidden="true" /> : null}</button>)}
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === 'reuse'} title="以前の項目から選ぶ" onClose={() => setSheet(null)}>
        <div className="reuse-picker" data-uilab-component="TaskForm.ReuseSheet" data-uilab-id="task-reuse-sheet">
          <input aria-label="以前の項目を検索" placeholder="検索" value={reuseQuery} onChange={(event) => setReuseQuery(event.target.value)} />
          <div className="selection-list">{filteredReuse.map((item) => <button type="button" key={item.id} className="reuse-result" onClick={() => selectReuse(item)}><span>{item.name}</span><small>{repeatSummary(item)}</small></button>)}{filteredReuse.length === 0 ? <p className="reuse-empty">見つかりませんでした</p> : null}</div>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === 'delete'} title="家事を削除しますか？" onClose={() => setSheet(null)}>
        <div className="delete-confirm" data-uilab-component="TaskForm.DeleteConfirm" data-uilab-id="task-delete-confirm">
          <p>この家事を削除します。</p>
          <button type="button" className="form-delete" onClick={() => { onTaskDelete?.(); setSheet(null); setStatusMessage('削除しました'); }}>削除する</button>
          <button type="button" className="form-secondary" onClick={() => setSheet(null)}>キャンセル</button>
        </div>
      </BottomSheet>
    </div>
  );
}

function repeatSummary(item: { repeat: RepeatOption; weekdays?: string[]; monthDay?: string }) {
  if (item.repeat === '曜日を決める') return item.weekdays?.length ? item.weekdays.join('・') : '曜日を決める';
  if (item.repeat === '毎月○日') return `毎月${item.monthDay ?? '20'}日`;
  return item.repeat;
}
