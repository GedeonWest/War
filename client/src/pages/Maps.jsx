import { useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import EntityModal from '../components/EntityModal';
import '../styles/pages/page-common.scss';

export default function Maps() {
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const maps = (raw && raw.maps) || [];
  const [selectedMap, setSelectedMap] = useState(null);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_maps arcane-glow">
      <h1 className="page__title">Карты</h1>
      {Array.isArray(maps) && maps.length > 0 ? (
        <ul className="maps-grid">
          {maps.map((item, i) => (
            <li
              key={`${item.title || 'map'}-${i}`}
              className="maps-grid__item"
              onClick={() => setSelectedMap(item)}
            >
              <article className="map-card">
                <div className="map-card__media">
                  {item.imgref ? <img src={item.imgref} alt={item.title || 'Карта'} className="map-card__img" loading="lazy" /> : null}
                </div>
                <div className="map-card__body">
                  <h2 className="map-card__title">{item.title || `Карта ${i + 1}`}</h2>
                  {item.description && <p className="map-card__text">{item.description}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="page__muted">Карты можно добавить в админке.</p>
      )}
      <EntityModal
        open={Boolean(selectedMap)}
        title={selectedMap?.title || 'Карта'}
        image={selectedMap?.imgref}
        fullImage
        onClose={() => setSelectedMap(null)}
        fields={
          selectedMap
            ? [
                { label: 'Описание', value: selectedMap.description },
                { label: 'Локация', value: selectedMap.location },
                { label: 'Примечания', value: selectedMap.notes || selectedMap.details },
              ]
            : []
        }
      />
    </div>
  );
}
