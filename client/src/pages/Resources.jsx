import { useDataStore } from '../store/useDataStore';
import { Icon } from '@iconify/react';
import '../styles/pages/page-common.scss';

export default function Resources() {
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const resources = (raw && raw.resources) || [];

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_resources arcane-glow">
      <h1 className="page__title">Ресурсы</h1>
      {Array.isArray(resources) && resources.length > 0 ? (
        <ul className="page__list">
          {resources.map((item, i) => (
            <li key={i} className="page__list-item">
              {item.title && <strong className="page__list-title">{item.title}</strong>}
              {item.content && <p className="page__list-text">{item.content}</p>}
              {item.url && (
                <a className="arcane-button" href={item.url} target="_blank" rel="noreferrer">
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
    </div>
  );
}
