import { useState } from 'react';

const STORAGE_KEY = 'war_admin_github';

export function getStoredGitHub() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return { owner: '', repo: '', token: '' };
    const o = JSON.parse(s);
    return { owner: o.owner || '', repo: o.repo || '', token: o.token || '' };
  } catch {
    return { owner: '', repo: '', token: '' };
  }
}

export function setStoredGitHub({ owner, repo, token }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ owner, repo, token: token || '' }));
}

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [owner, setOwner] = useState(getStoredGitHub().owner);
  const [repo, setRepo] = useState(getStoredGitHub().repo);
  const [token, setToken] = useState(getStoredGitHub().token);

  const save = () => {
    setStoredGitHub({ owner, repo, token });
    setOpen(false);
  };

  return (
    <section className="settings">
      <button type="button" className="settings__toggle" onClick={() => setOpen((v) => !v)}>
        {open ? 'Скрыть настройки GitHub' : 'Настройки GitHub (токен, репозиторий)'}
      </button>
      {open && (
        <div className="settings__panel">
          <label className="settings__field">
            Владелец репо (owner):
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="username"
              className="settings__input"
            />
          </label>
          <label className="settings__field">
            Репозиторий:
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="War"
              className="settings__input"
            />
          </label>
          <label className="settings__field">
            Personal Access Token (с правом repo):
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="settings__input"
            />
          </label>
          <button type="button" className="settings__save" onClick={save}>Сохранить локально</button>
        </div>
      )}
    </section>
  );
}
