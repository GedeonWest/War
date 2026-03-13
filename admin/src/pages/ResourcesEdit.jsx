import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from '../components/Settings';
import { saveFile } from '../services/githubApi';

export default function ResourcesEdit() {
  const fetchData = useAdminStore((s) => s.fetchData);
  const raw = useAdminStore((s) => s.raw);
  const loading = useAdminStore((s) => s.loading);
  const resources = (raw && raw.resources) || [];
  const setResources = useAdminStore((s) => s.setResources);
  const setSaved = useAdminStore((s) => s.setSaved);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = () => {
    setResources([...resources, { title: '', content: '', url: '' }]);
  };

  const update = (index, field, value) => {
    const next = [...resources];
    next[index] = { ...next[index], [field]: value };
    setResources(next);
  };

  const remove = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSaveToGitHub = async () => {
    const { owner, repo, token } = getStoredGitHub();
    if (!owner || !repo || !token) {
      alert('Заполните настройки GitHub.');
      return;
    }
    try {
      await saveFile({
        owner,
        repo,
        path: 'client/public/data/agents.json',
        content: JSON.stringify(raw, null, 2),
        message: 'Update resources',
        token,
      });
      setSaved(true);
      alert('Сохранено в GitHub.');
    } catch (e) {
      alert('Ошибка: ' + e.message);
    }
  };

  if (loading) return <p className="page__muted">Загрузка…</p>;

  return (
    <div className="page">
      <h1 className="page__title">Ресурсы</h1>
      <button type="button" onClick={add} style={{ marginBottom: 16 }}>Добавить ресурс</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {resources.map((item, i) => (
          <li key={i} style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
            <input
              placeholder="Заголовок"
              value={item.title || ''}
              onChange={(e) => update(i, 'title', e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 8 }}
            />
            <textarea
              placeholder="Содержание"
              value={item.content || ''}
              onChange={(e) => update(i, 'content', e.target.value)}
              rows={3}
              style={{ display: 'block', width: '100%', marginBottom: 8 }}
            />
            <input
              placeholder="URL"
              value={item.url || ''}
              onChange={(e) => update(i, 'url', e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 8 }}
            />
            <button type="button" onClick={() => remove(i)}>Удалить</button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleSaveToGitHub}>Сохранить в GitHub</button>
    </div>
  );
}
