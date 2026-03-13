import { useDataStore } from '../store/useDataStore';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import EntityModal from '../components/EntityModal';
import '../styles/pages/page-common.scss';

export default function Resources() {
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const resources = (raw && (raw.materials || raw.resources)) || [];
  const [selected, setSelected] = useState(null);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_resources arcane-glow">
      <h1 className="page__title">Ресурсы</h1>
      {Array.isArray(resources) && resources.length > 0 ? (
        <ul className="page__list">
          {resources.map((item, i) => (
            <li key={i} className="page__list-item page__list-item_clickable" onClick={() => setSelected(item)}>
              {item.title && <strong className="page__list-title">{item.title}</strong>}
              {(item.description || item.content) && <p className="page__list-text">{item.description || item.content}</p>}
              {item.url && (
                <a
                  className="arcane-button"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="game-icons:checked-shield" className="arcane-button__icon" />
                  Открыть ресурс
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="page__muted">Контент можно добавить в админке.</p>
      )}
      <EntityModal
        open={Boolean(selected)}
        title={selected?.title || 'Материал'}
        image={selected?.image}
        onClose={() => setSelected(null)}
        fields={
          selected
            ? [
                { label: 'Описание', value: selected.description || selected.content },
                { label: 'Подробно', value: selected.details || selected.longDescription },
                { label: 'Ссылка', value: selected.url },
              ]
            : []
        }
      />
    </div>
  );
}
