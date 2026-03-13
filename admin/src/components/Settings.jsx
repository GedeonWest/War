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
    <div style={{ marginBottom: 16 }}>
      <button type="button" onClick={() => setOpen((v) => !v)}>
        {open ? 'Скрыть настройки GitHub' : 'Настройки GitHub (токен, репозиторий)'}
      </button>
      {open && (
        <div style={{ marginTop: 8, padding: 16, background: '#f0f0f0', borderRadius: 4, maxWidth: 400 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Владелец репо (owner):
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="username"
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Репозиторий:
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="War"
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Personal Access Token (с правом repo):
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
          <button type="button" onClick={save}>Сохранить локально</button>
        </div>
      )}
    </div>
  );
}
