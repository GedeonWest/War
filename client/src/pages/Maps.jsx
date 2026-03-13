import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDataStore } from '../store/useDataStore';
import MapViewer from '../components/MapViewer';
import '../styles/pages/page-common.scss';

export default function Maps() {
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const maps = (raw && raw.maps) || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedMap = useMemo(() => maps[selectedIndex] || maps[0], [maps, selectedIndex]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_maps arcane-glow">
      <h1 className="page__title">Карты</h1>
      {Array.isArray(maps) && maps.length > 0 ? (
        <div className="maps-panel">
          <nav className="maps-panel__tabs">
            {maps.map((item, i) => (
              <button
                type="button"
                key={i}
                className={`arcane-button maps-panel__tab ${i === selectedIndex ? 'maps-panel__tab_active' : ''}`}
                onClick={() => setSelectedIndex(i)}
              >
                <Icon icon="game-icons:crown" className="arcane-button__icon" />
                {item.title || `Карта ${i + 1}`}
              </button>
            ))}
          </nav>
          <MapViewer map={selectedMap} />
        </div>
      ) : (
        <p className="page__muted">Карты можно добавить в админке.</p>
      )}
    </div>
  );
}
