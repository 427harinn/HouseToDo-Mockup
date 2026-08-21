import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';

type Member = {
  id: string;
  name: string;
  initials: string;
};

type Sheet = 'invite' | 'timezone' | 'logout' | null;

const MEMBERS: Member[] = [
  { id: 'yuki', name: 'ゆき', initials: 'ゆ' },
  { id: 'haru', name: 'はる', initials: 'は' },
];

const TIMEZONES = ['Asia/Tokyo', 'America/Los_Angeles', 'Europe/London'];

const INVITE_CODE = 'HOUSE-4821';

const OTHER_ROUTES = [
  { path: '#/other/members', label: 'メンバー', id: 'other-members' },
  { path: '#/other/notifications', label: '通知', id: 'other-notifications' },
  { path: '#/other/household', label: '家庭設定', id: 'other-household' },
  { path: '#/other/account', label: 'アカウント', id: 'other-account' },
];

export function OtherLandingPage() {
  return (
    <section className="screen-content other-page" data-uilab-component="Other.Page" data-uilab-id="other-page">
      <header className="other-page__header">
        <h1>その他</h1>
      </header>
      <nav className="other-navigation" aria-label="その他の設定" data-uilab-component="Other.NavigationList" data-uilab-id="other-navigation-list">
        {OTHER_ROUTES.map((route) => (
          <a key={route.id} href={route.path} className="other-navigation__row" data-uilab-component="Other.NavigationRow" data-uilab-id={route.id}>
            <span>{route.label}</span>
            <ChevronRight aria-hidden="true" />
          </a>
        ))}
      </nav>
    </section>
  );
}

function SettingsHeader({ title }: { title: string }) {
  return (
    <header className="settings-page__header">
      <button type="button" className="settings-page__back" aria-label="戻る" onClick={() => { window.location.hash = '#/other'; }}>
        <ChevronLeft aria-hidden="true" />
        <span>戻る</span>
      </button>
      <h1>{title}</h1>
    </header>
  );
}

function normalizeState<T extends string>(state: string, states: readonly T[]): T {
  return (states.includes(state as T) ? state : states[0]) as T;
}

export function MembersPage({ state }: { state: string }) {
  const safeState = normalizeState(state, ['normal', 'invite-open'] as const);
  const [sheet, setSheet] = useState<Sheet>(safeState === 'invite-open' ? 'invite' : null);
  const [copyStatus, setCopyStatus] = useState('');

  return (
    <section className="screen-content settings-page members-page" data-uilab-component="Settings.Page" data-uilab-id="members-page">
      <SettingsHeader title="メンバー" />
      <div className="settings-list" data-uilab-component="Members.List" data-uilab-id="members-list">
        {MEMBERS.map((member) => (
          <div key={member.id} className="settings-row member-row" data-uilab-component="Members.Row" data-uilab-id={`member-${member.id}`}>
            <span className="other-avatar" role="img" aria-label={`アバター: ${member.name}`}>{member.initials}</span>
            <span className="settings-row__main">{member.name}</span>
          </div>
        ))}
        <button type="button" className="settings-row settings-row--button members-page__invite" data-uilab-component="Members.InviteRow" data-uilab-id="members-invite-row" onClick={() => { setCopyStatus(''); setSheet('invite'); }}>
          <span className="settings-row__main">招待する</span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <p className="settings-status" role="status" aria-live="polite">{copyStatus}</p>
      <BottomSheet open={sheet === 'invite'} title="メンバーを招待" onClose={() => setSheet(null)} uilabComponent="Members.InviteSheet" uilabId="members-invite-sheet">
        <div className="invite-sheet" data-uilab-component="Members.InviteSheetContent" data-uilab-id="members-invite-sheet-content">
          <div className="invite-sheet__code" aria-label={`招待コード ${INVITE_CODE}`}>{INVITE_CODE}</div>
          <button type="button" className="settings-primary-action" onClick={() => setCopyStatus('コードをコピーしました')}>コードをコピー</button>
        </div>
      </BottomSheet>
    </section>
  );
}

export function NotificationsPage({ state }: { state: string }) {
  const safeState = normalizeState(state, ['normal', 'morning-off', 'all-off'] as const);
  const [morningEnabled, setMorningEnabled] = useState(safeState !== 'morning-off' && safeState !== 'all-off');
  const [eveningEnabled, setEveningEnabled] = useState(safeState !== 'all-off');
  const [morningTime, setMorningTime] = useState('09:00');
  const [eveningTime, setEveningTime] = useState('21:00');

  return (
    <section className="screen-content settings-page notifications-page" data-uilab-component="Settings.Page" data-uilab-id="notifications-page">
      <SettingsHeader title="通知" />
      <div className="settings-list">
        <label className="settings-toggle" data-uilab-component="Notifications.MorningToggle" data-uilab-id="notifications-morning-toggle">
          <span>朝のまとめ通知</span>
          <input aria-label="朝のまとめ通知" type="checkbox" checked={morningEnabled} onChange={(event) => setMorningEnabled(event.target.checked)} />
          <span className="settings-toggle__visual" aria-hidden="true" />
        </label>
        {morningEnabled ? (
          <label className="settings-field settings-field--time" data-uilab-component="Notifications.MorningTime" data-uilab-id="notifications-morning-time">
            <span>時刻</span>
            <input aria-label="朝のまとめ通知の時刻" type="time" value={morningTime} onChange={(event) => setMorningTime(event.target.value)} />
          </label>
        ) : null}
        <label className="settings-toggle" data-uilab-component="Notifications.EveningToggle" data-uilab-id="notifications-evening-toggle">
          <span>夜のまとめ通知</span>
          <input aria-label="夜のまとめ通知" type="checkbox" checked={eveningEnabled} onChange={(event) => setEveningEnabled(event.target.checked)} />
          <span className="settings-toggle__visual" aria-hidden="true" />
        </label>
        {eveningEnabled ? (
          <label className="settings-field settings-field--time" data-uilab-component="Notifications.EveningTime" data-uilab-id="notifications-evening-time">
            <span>時刻</span>
            <input aria-label="夜のまとめ通知の時刻" type="time" value={eveningTime} onChange={(event) => setEveningTime(event.target.value)} />
          </label>
        ) : null}
      </div>
    </section>
  );
}

export function HouseholdPage({ state }: { state: string }) {
  const safeState = normalizeState(state, ['normal', 'timezone-open', 'saved'] as const);
  const [name, setName] = useState('わが家');
  const [timezone, setTimezone] = useState('Asia/Tokyo');
  const [sheet, setSheet] = useState<Sheet>(safeState === 'timezone-open' ? 'timezone' : null);
  const [statusMessage, setStatusMessage] = useState(safeState === 'saved' ? '保存しました' : '');

  return (
    <section className="screen-content settings-page household-page" data-uilab-component="Settings.Page" data-uilab-id="household-page">
      <SettingsHeader title="家庭設定" />
      <div className="settings-list household-page__form">
        <label className="settings-field" data-uilab-component="Household.Name" data-uilab-id="household-name">
          <span>家庭名</span>
          <input aria-label="家庭名" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button type="button" className="settings-row settings-row--button" data-uilab-component="Household.Timezone" data-uilab-id="household-timezone" aria-label={`タイムゾーン: ${timezone}`} onClick={() => setSheet('timezone')}>
          <span className="settings-row__main">タイムゾーン</span>
          <span className="settings-row__value">{timezone}<ChevronRight aria-hidden="true" /></span>
        </button>
      </div>
      <div className="settings-actions">
        <button type="button" className="settings-primary-action" data-uilab-component="Household.Save" data-uilab-id="household-save" onClick={() => setStatusMessage('保存しました')}>保存</button>
      </div>
      <p className="settings-status" role="status" aria-live="polite">{statusMessage}</p>
      <BottomSheet open={sheet === 'timezone'} title="タイムゾーン" onClose={() => setSheet(null)} uilabComponent="Household.TimezoneSheet" uilabId="household-timezone-sheet">
        <div className="selection-list" data-uilab-component="Household.TimezoneOptions" data-uilab-id="household-timezone-options">
          {TIMEZONES.map((option) => (
            <button key={option} type="button" className="selection-list__row" onClick={() => { setTimezone(option); setSheet(null); }}>
              <span>{option}</span>
              {timezone === option ? <Check aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      </BottomSheet>
    </section>
  );
}

export function AccountPage({ state }: { state: string }) {
  const safeState = normalizeState(state, ['normal', 'logout-confirm'] as const);
  const [displayName, setDisplayName] = useState('はる');
  const [sheet, setSheet] = useState<Sheet>(safeState === 'logout-confirm' ? 'logout' : null);
  const [statusMessage, setStatusMessage] = useState('');

  return (
    <section className="screen-content settings-page account-page" data-uilab-component="Settings.Page" data-uilab-id="account-page">
      <SettingsHeader title="アカウント" />
      <div className="account-profile" data-uilab-component="Account.Profile" data-uilab-id="account-profile">
        <span className="other-avatar other-avatar--large" role="img" aria-label="アバター: はる">は</span>
        <label className="settings-field">
          <span>表示名</span>
          <input aria-label="表示名" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label className="settings-field">
          <span>メール</span>
          <input aria-label="メール" value="haru@example.com" readOnly />
        </label>
      </div>
      <div className="account-page__logout">
        <button type="button" className="settings-danger-action" data-uilab-component="Account.Logout" data-uilab-id="account-logout" onClick={() => setSheet('logout')}>ログアウト</button>
      </div>
      <p className="settings-status" role="status" aria-live="polite">{statusMessage}</p>
      <BottomSheet open={sheet === 'logout'} title="ログアウトしますか？" onClose={() => setSheet(null)} uilabComponent="Account.LogoutConfirm" uilabId="account-logout-confirm">
        <div className="logout-confirm" data-uilab-component="Account.LogoutConfirm" data-uilab-id="account-logout-confirm-content">
          <button type="button" className="settings-danger-action" onClick={() => { setSheet(null); setStatusMessage('ログアウトしました'); }}>ログアウト</button>
          <button type="button" className="settings-secondary-action" onClick={() => setSheet(null)}>キャンセル</button>
        </div>
      </BottomSheet>
    </section>
  );
}
