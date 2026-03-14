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

function getDraftErrors(fields, draft) {
  const next = {};

  fields.forEach((field) => {
    const value = draft[field.name];
    const normalized = typeof value === 'string' ? value.trim() : value;

    if (field.required && !normalized) {
      next[field.name] = field.requiredMessage || `Поле "${field.label}" обязательно.`;
      return;
    }

    if ((field.type === 'url' || field.type === 'image') && normalized) {
      try {
        // URL constructor handles robust validation for http(s) and absolute links.
        // We store only absolute URLs in the JSON data.
        // eslint-disable-next-line no-new
        new URL(normalized);
      } catch {
        next[field.name] = `Укажите корректный URL для поля "${field.label}".`;
      }
    }
  });

  return next;
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
  const [modalMode, setModalMode] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [draft, setDraft] = useState({ ...emptyItem });
  const [draftErrors, setDraftErrors] = useState({});

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

  const openCreateModal = () => {
    setDraft({ ...emptyItem });
    setDraftErrors({});
    setModalMode('create');
    setModalIndex(null);
  };

  const openEditModal = (index) => {
    const source = list[index] || {};
    setDraft({ ...emptyItem, ...source });
    setDraftErrors({});
    setModalMode('edit');
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalMode(null);
    setModalIndex(null);
    setDraft({ ...emptyItem });
    setDraftErrors({});
  };

  const remove = (index) => {
    setList(list.filter((_, i) => i !== index));
    if (modalMode === 'edit' && modalIndex === index) {
      closeModal();
    }
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setDraftErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const saveModal = () => {
    const errors = getDraftErrors(fields, draft);
    if (Object.keys(errors).length > 0) {
      setDraftErrors(errors);
      return;
    }

    if (modalMode === 'create') {
      setList([...list, draft]);
      closeModal();
      return;
    }
    if (modalMode === 'edit' && modalIndex !== null) {
      const next = [...list];
      next[modalIndex] = { ...draft };
      setList(next);
      closeModal();
    }
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
        <button type="button" onClick={openCreateModal}>Создать запись</button>
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
              <tr key={index} className={modalMode === 'edit' && modalIndex === index ? 'admin-table__row_active' : ''}>
                <td>
                  <button
                    type="button"
                    className="admin-table__name-btn"
                    onClick={() => openEditModal(index)}
                  >
                    {getCardTitle(item)}
                  </button>
                </td>
                <td>{getCardSubtitle(item) || '—'}</td>
                <td>{item.status || item.rarity || '—'}</td>
                <td>{getCardDescription(item) || '—'}</td>
                <td className="admin-table__actions">
                  <button type="button" onClick={() => openEditModal(index)} aria-label="Редактировать">
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

      {modalMode && (
        <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Редактирование сущности">
          <button type="button" className="admin-modal__backdrop" onClick={closeModal} aria-label="Закрыть модалку" />
          <div className="admin-modal__dialog">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {modalMode === 'create' ? 'Создание записи' : `Редактирование: ${getCardTitle(draft)}`}
              </h3>
              <button type="button" className="admin-modal__close" onClick={closeModal} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <div className="admin-modal__body">
              <div className="admin-edit__details-body">
                {fields.map((field) => (
                  <label
                    key={field.name}
                    className={`admin-edit__field ${draftErrors[field.name] ? 'admin-edit__field_invalid' : ''}`}
                  >
                    <span className="admin-edit__label">
                      {field.label}
                      {field.required && <span className="admin-edit__required"> *</span>}
                    </span>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={field.rows || 3}
                        value={draft[field.name] || ''}
                        aria-invalid={Boolean(draftErrors[field.name])}
                        onChange={(e) => updateDraft(field.name, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={draft[field.name] || ''}
                        aria-invalid={Boolean(draftErrors[field.name])}
                        onChange={(e) => updateDraft(field.name, e.target.value)}
                      />
                    )}
                    {draftErrors[field.name] && (
                      <span className="admin-edit__field-error">{draftErrors[field.name]}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="admin-modal__actions">
              <button type="button" className="admin-modal__button admin-modal__button_cancel" onClick={closeModal}>
                Отмена
              </button>
              <button type="button" className="admin-modal__button admin-modal__button_save" onClick={saveModal}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
