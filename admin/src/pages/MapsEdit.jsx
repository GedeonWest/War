import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from '../components/Settings';
import { saveFile } from '../services/githubApi';

export default function MapsEdit() {
  const fetchData = useAdminStore((s) => s.fetchData);
  const raw = useAdminStore((s) => s.raw);
  const loading = useAdminStore((s) => s.loading);
  const maps = (raw && raw.maps) || [];
  const setMaps = useAdminStore((s) => s.setMaps);
  const setSaved = useAdminStore((s) => s.setSaved);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = () => {
    setMaps([...maps, { title: '', imgref: '', description: '' }]);
  };

  const update = (index, field, value) => {
    const next = [...maps];
    next[index] = { ...next[index], [field]: value };
    setMaps(next);
  };

  const remove = (index) => {
    setMaps(maps.filter((_, i) => i !== index));
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
        message: 'Update maps',
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
      <h1 className="page__title">Карты</h1>
      <button type="button" onClick={add} style={{ marginBottom: 16 }}>Добавить карту</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {maps.map((item, i) => (
          <li key={i} style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
            <input
              placeholder="Название"
              value={item.title || ''}
              onChange={(e) => update(i, 'title', e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 8 }}
            />
            <input
              placeholder="URL изображения"
              value={item.imgref || ''}
              onChange={(e) => update(i, 'imgref', e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 8 }}
            />
            <textarea
              placeholder="Описание"
              value={item.description || ''}
              onChange={(e) => update(i, 'description', e.target.value)}
              rows={2}
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
