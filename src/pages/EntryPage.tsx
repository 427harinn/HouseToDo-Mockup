import { useState, type FormEvent } from 'react';

export type EntryPageKind = 'login' | 'register' | 'household-create' | 'household-join';

type EntryPageProps = {
  kind: EntryPageKind;
  state?: string;
};

const pageCopy: Record<EntryPageKind, { title: string; action: string }> = {
  login: { title: 'ログイン', action: 'ログイン' },
  register: { title: '新規登録', action: '新規登録' },
  'household-create': { title: '家庭を作る', action: '家庭を作る' },
  'household-join': { title: '招待から参加', action: '参加する' },
};

export function EntryPage({ kind, state = 'normal' }: EntryPageProps) {
  const copy = pageCopy[kind];
  const isError = state === 'error';
  const isInvalidCode = kind === 'household-join' && state === 'invalid-code';
  const isInvalidRegisterInviteCode = kind === 'register' && state === 'invalid-invite-code';
  const [inviteCode, setInviteCode] = useState(() => {
    if (kind !== 'register') return '';
    if (state === 'invite-code') return 'HT-2026';
    if (state === 'invalid-invite-code') return 'INVALID';
    return '';
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (kind === 'register') {
      if (isInvalidRegisterInviteCode && inviteCode.trim()) return;
      window.location.hash = inviteCode.trim() ? '#/home' : '#/household/create';
      return;
    }
    const nextPath = kind === 'login' || kind === 'household-create' || kind === 'household-join'
      ? '/home'
      : '/household/create';
    window.location.hash = `#${nextPath}`;
  };

  return (
    <div className="screen-content entry-page" data-uilab-component="Entry.Page" data-uilab-id={`${kind}-page`}>
      <div className="entry-page__content">
        <header className="entry-page__header" data-uilab-component="Entry.Header" data-uilab-id={`${kind}-header`}>
          <h1 data-uilab-component="Entry.Title" data-uilab-id={`${kind}-title`}>{copy.title}</h1>
        </header>

        <form className="entry-form" onSubmit={handleSubmit} data-uilab-component="Entry.Form" data-uilab-id={`${kind}-form`}>
          {kind === 'register' ? (
            <EntryField id="register-name" label="表示名" type="text" autoComplete="name" />
          ) : null}

          {kind === 'login' || kind === 'register' ? (
            <EntryField id={`${kind}-email`} label="メールアドレス" type="email" autoComplete="email" invalid={kind === 'register' && isError} />
          ) : null}

          {kind === 'login' || kind === 'register' ? (
            <EntryField
              id={`${kind}-password`}
              label="パスワード"
              type="password"
              autoComplete={kind === 'login' ? 'current-password' : 'new-password'}
              invalid={kind === 'login' && isError}
              errorMessage={kind === 'login' && isError ? 'メールアドレスまたはパスワードが正しくありません' : undefined}
            />
          ) : null}

          {kind === 'register' ? (
            <EntryField
              id="register-invite-code"
              label="招待コード（任意）"
              type="text"
              autoComplete="off"
              value={inviteCode}
              onValueChange={setInviteCode}
              invalid={isInvalidRegisterInviteCode}
              errorMessage={isInvalidRegisterInviteCode ? '招待コードを確認してください' : undefined}
            />
          ) : null}

          {kind === 'household-create' ? (
            <EntryField id="household-create-name" label="家庭名" type="text" autoComplete="organization" />
          ) : null}

          {kind === 'household-join' ? (
            <EntryField
              id="household-join-code"
              label="招待コード"
              type="text"
              autoComplete="off"
              invalid={isInvalidCode}
              errorMessage={isInvalidCode ? '招待コードを確認してください' : undefined}
            />
          ) : null}

          {kind === 'register' && isError ? (
            <p className="entry-form__error" role="alert" data-uilab-component="Entry.FieldError" data-uilab-id="register-form-error">
              入力内容を確認してください
            </p>
          ) : null}

          <button type="submit" className="form-save entry-primary-action" data-uilab-component="Entry.PrimaryAction" data-uilab-id={`${kind}-submit`}>
            {copy.action}
          </button>
        </form>

        <EntryLinks kind={kind} />
      </div>
    </div>
  );
}

function EntryField({ autoComplete, errorMessage, id, invalid = false, label, onValueChange, type, value }: { autoComplete: string; errorMessage?: string; id: string; invalid?: boolean; label: string; onValueChange?: (value: string) => void; type: string; value?: string }) {
  const errorId = `${id}-error`;
  return (
    <label className="form-control entry-field" data-uilab-component="Entry.Field" data-uilab-id={id}>
      <span>{label}</span>
      <input id={id} name={id} type={type} autoComplete={autoComplete} value={value} onChange={onValueChange ? (event) => onValueChange(event.currentTarget.value) : undefined} aria-invalid={invalid} aria-describedby={errorMessage ? errorId : undefined} />
      {errorMessage ? <span id={errorId} className="entry-field__error" role="alert" data-uilab-component="Entry.FieldError" data-uilab-id={errorId}>{errorMessage}</span> : null}
    </label>
  );
}

function EntryLinks({ kind }: { kind: EntryPageKind }) {
  if (kind === 'login') {
    return <p className="entry-link-row"><span>はじめての方は</span> <a href="#/register" data-uilab-component="Entry.SecondaryLink" data-uilab-id="login-register-link">アカウントを作る</a></p>;
  }

  if (kind === 'register') {
    return <p className="entry-link-row"><span>すでにアカウントを持っている方</span> <a href="#/login" data-uilab-component="Entry.SecondaryLink" data-uilab-id="register-login-link">ログイン</a></p>;
  }

  if (kind === 'household-create') {
    return <p className="entry-link-row"><span>招待コードをお持ちの場合は</span> <a href="#/household/join" data-uilab-component="Entry.SecondaryLink" data-uilab-id="create-join-link">招待から参加</a></p>;
  }

  return <p className="entry-link-row"><span>家庭を新しく作る場合は</span> <a href="#/household/create" data-uilab-component="Entry.SecondaryLink" data-uilab-id="join-create-link">家庭を作る</a></p>;
}
