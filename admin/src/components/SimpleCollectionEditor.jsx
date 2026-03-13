import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from './Settings';
import { saveFile } from '../services/githubApi';

export default function SimpleCollectionEditor({
  title,
  description,
  collectionKey,
  emptyItem,
  fields,
}) {
  const fetchData = useAdminStore((s) => s.fetchData);
  const raw = useAdminStore((s) => s.raw);
  const loading = useAdminStore((s) => s.loading);
  const setRaw = useAdminStore((s) => s.setRaw);
  const setSaved = useAdminStore((s) => s.setSaved);
  const error = useAdminStore((s) => s.error);

  const list = (raw && raw[collectionKey]) || [];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setList = (next) => {
    const merged = { ...raw, [collectionKey]: next };
    if (collectionKey === 'materials') {
      merged.resources = next;
    }
    setRaw(merged);
  };

  const add = () => setList([...list, { ...emptyItem }]);

  const update = (index, field, value) => {
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    setList(next);
  };

  const remove = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSaveToGitHub = async () => {
    const { owner, repo, token } = getStoredGitHub();
    if (!owner || !repo || !token) {
      alert('Заполните настройки GitHub (owner, repo, token) на странице Обзор.');
      return;
    }
    try {
      await saveFile({
        owner,
        repo,
        path: 'client/public/data/agents.json',
        content: JSON.stringify(raw, null, 2),
        message: `Update ${collectionKey}`,
        token,
      });
      setSaved(true);
      alert('Сохранено в GitHub. Изменения появятся на клиенте после деплоя.');
    } catch (e) {
      alert(`Ошибка сохранения: ${e.message}`);
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">{title}</h1>
      {description && <p className="page__muted">{description}</p>}
      {loading && <p className="page__muted">Загрузка данных…</p>}
      {error && <p className="page__error">Не удалось загрузить файл данных, можно продолжить с пустой формой.</p>}

      <div className="admin-edit__toolbar">
        <button type="button" onClick={add}>Добавить</button>
        <button type="button" onClick={handleSaveToGitHub}>Сохранить в GitHub</button>
      </div>

      <ul className="admin-edit__list">
        {list.map((item, i) => (
          <li key={i} className="admin-edit__item">
            {fields.map((field) => (
              <label key={field.name} className="admin-edit__field">
                <span className="admin-edit__label">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={field.rows || 3}
                    value={item[field.name] || ''}
                    onChange={(e) => update(i, field.name, e.target.value)}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={item[field.name] || ''}
                    onChange={(e) => update(i, field.name, e.target.value)}
                  />
                )}
              </label>
            ))}
            <button type="button" onClick={() => remove(i)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
