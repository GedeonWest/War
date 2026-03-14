import { useEffect, useMemo, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from './Settings';
import { saveFile } from '../services/githubApi';

function getCardTitle(item) {
  return item.name || item.title || item.role || item.type || 'Без названия';
}

function getCardSubtitle(item) {
  return item.role || item.status || item.rarity || item.type || item.location || '';
}

function getCardDescription(item) {
  return item.shortDescription || item.description || item.details || item.notes || '';
}

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
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const list = (raw && raw[collectionKey]) || [];

  const statusOptions = useMemo(() => {
    const values = list.map((item) => item.status || item.rarity || '').filter(Boolean);
    return [...new Set(values)];
  }, [list]);

  const filteredList = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return list
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const haystack = [
          item.name,
          item.title,
          item.role,
          item.type,
          item.status,
          item.rarity,
          item.shortDescription,
          item.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const statusValue = item.status || item.rarity || '';
        const queryMatch = !normalized || haystack.includes(normalized);
        const statusMatch = !statusFilter || statusValue === statusFilter;
        return queryMatch && statusMatch;
      });
  }, [list, query, statusFilter]);

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

  const add = () => {
    const next = [...list, { ...emptyItem }];
    setList(next);
    setEditIndex(next.length - 1);
  };

  const update = (index, field, value) => {
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    setList(next);
  };

  const remove = (index) => {
    setList(list.filter((_, i) => i !== index));
    setEditIndex((current) => {
      if (current === null) return null;
      if (current === index) return null;
      return current > index ? current - 1 : current;
    });
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

      <div className="admin-edit__filters">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени, роли, описанию..."
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="admin-edit__table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя / Название</th>
              <th>Роль / Тип</th>
              <th>Статус / Редкость</th>
              <th>Описание</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredList.map(({ item, index }) => (
              <tr key={index} className={editIndex === index ? 'admin-table__row_active' : ''}>
                <td>
                  <button
                    type="button"
                    className="admin-table__name-btn"
                    onClick={() => setEditIndex(index)}
                  >
                    {getCardTitle(item)}
                  </button>
                </td>
                <td>{getCardSubtitle(item) || '—'}</td>
                <td>{item.status || item.rarity || '—'}</td>
                <td>{getCardDescription(item) || '—'}</td>
                <td className="admin-table__actions">
                  <button type="button" onClick={() => setEditIndex(index)} aria-label="Редактировать">
                    ✎
                  </button>
                  <button type="button" onClick={() => remove(index)} aria-label="Удалить">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={5}>Ничего не найдено по текущим фильтрам.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editIndex !== null && list[editIndex] && (
        <section className="admin-edit__panel">
          <h3>Редактирование: {getCardTitle(list[editIndex])}</h3>
          <div className="admin-edit__details-body">
            {fields.map((field) => (
              <label key={field.name} className="admin-edit__field">
                <span className="admin-edit__label">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={field.rows || 3}
                    value={list[editIndex][field.name] || ''}
                    onChange={(e) => update(editIndex, field.name, e.target.value)}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={list[editIndex][field.name] || ''}
                    onChange={(e) => update(editIndex, field.name, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
