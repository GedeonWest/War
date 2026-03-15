/**
 * Сохранение данных в репозиторий через GitHub API.
 * Токен и репозиторий задаются в админке (локально).
 */

const GITHUB_API = 'https://api.github.com';

export async function saveFile({ owner, repo, path, content, message, token }) {
  const getRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  let sha;
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }

  const base64Content =
    typeof content === 'string'
      ? (content.match(/^[A-Za-z0-9+/=]+$/) ? content : btoa(unescape(encodeURIComponent(content))))
      : content;

  const body = {
    message: message || `Update ${path}`,
    content: base64Content,
    sha: sha || undefined,
  };

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
}

export async function uploadImage({ owner, repo, path, base64Content, message, token }) {
  return saveFile({
    owner,
    repo,
    path,
    content: base64Content,
    message: message || `Add image ${path}`,
    token,
  });
}

export async function getDefaultBranch({ owner, repo, token }) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  return data.default_branch || 'main';
}

export function getRawUrl(owner, repo, branch, path) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
