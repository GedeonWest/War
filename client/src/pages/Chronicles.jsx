import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import '../styles/pages/chronicles.scss';

function sortChronicles(items) {
  return [...items].sort((a, b) => {
    const aOrder = Number(a.order ?? a.chapter ?? 0);
    const bOrder = Number(b.order ?? b.chapter ?? 0);
    if (!Number.isNaN(aOrder) && !Number.isNaN(bOrder) && aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return String(a.title || '').localeCompare(String(b.title || ''), 'ru');
  });
}

export default function Chronicles() {
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const chronicles = useDataStore((s) => s.getByCategory('chronicles'));

  const items = useMemo(() => sortChronicles(chronicles || []), [chronicles]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_chronicles">
      <h1 className="page__title">Хроники кампании</h1>
      <p className="page__muted">Ход приключения по главам, датам и ключевым событиям.</p>

      {items.length === 0 ? (
        <p className="page__muted">Хроник пока нет.</p>
      ) : (
        <ol className="chronicles__list">
          {items.map((item, index) => (
            <li key={`${item.title || 'chronicle'}-${index}`} className="chronicles__item">
              <header className="chronicles__header">
                <h2 className="chronicles__title">
                  {item.chapter ? `Глава ${item.chapter}. ` : ''}
                  {item.title || 'Без названия'}
                </h2>
                <div className="chronicles__meta">
                  {item.date && <span>{item.date}</span>}
                  {item.location && <span>{item.location}</span>}
                </div>
              </header>
              {item.summary && <p className="chronicles__summary">{item.summary}</p>}
              {item.description && <p className="chronicles__text">{item.description}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
