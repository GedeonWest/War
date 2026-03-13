import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/components/map-viewer.scss';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function MapViewer({ map }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const markers = useMemo(() => (Array.isArray(map?.markers) ? map.markers : []), [map]);

  const onWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.16 : -0.16;
    setScale((prev) => clamp(prev + delta, 1, 3.5));
  };

  const onMouseDown = (event) => {
    setDrag({
      startX: event.clientX - offset.x,
      startY: event.clientY - offset.y,
    });
  };

  const onMouseMove = (event) => {
    if (!drag) return;
    setOffset({
      x: event.clientX - drag.startX,
      y: event.clientY - drag.startY,
    });
  };

  const onMouseUp = () => setDrag(null);
  const onMouseLeave = () => setDrag(null);

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  if (!map?.imgref) return <p className="page__muted">У карты нет изображения.</p>;

  return (
    <section className="map-viewer arcane-glow">
      <header className="map-viewer__header">
        <h2 className="map-viewer__title">{map.title || 'Карта'}</h2>
        <div className="map-viewer__controls">
          <button type="button" className="arcane-button" onClick={() => setScale((v) => clamp(v - 0.2, 1, 3.5))}>
            <Icon icon="game-icons:broadsword" className="arcane-button__icon" />
            -
          </button>
          <span className="map-viewer__zoom">{Math.round(scale * 100)}%</span>
          <button type="button" className="arcane-button" onClick={() => setScale((v) => clamp(v + 0.2, 1, 3.5))}>
            <Icon icon="game-icons:broadsword" className="arcane-button__icon" />
            +
          </button>
          <button type="button" className="arcane-button" onClick={reset}>
            <Icon icon="game-icons:checked-shield" className="arcane-button__icon" />
            Сброс
          </button>
        </div>
      </header>

      <div
        className={`map-viewer__viewport ${drag ? 'map-viewer__viewport_drag' : ''}`}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="map-viewer__stage"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        >
          <img src={map.imgref} alt={map.title || 'map'} className="map-viewer__img" draggable={false} />

          {markers.map((marker, index) => (
            <button
              key={`${marker.x}-${marker.y}-${index}`}
              type="button"
              className={`map-viewer__marker ${activeMarker === index ? 'map-viewer__marker_active' : ''}`}
              style={{
                left: `${clamp(Number(marker.x) || 0, 0, 100)}%`,
                top: `${clamp(Number(marker.y) || 0, 0, 100)}%`,
              }}
              onClick={() => setActiveMarker((current) => (current === index ? null : index))}
              title={marker.label || `Точка ${index + 1}`}
            >
              ✦
            </button>
          ))}
        </div>
      </div>

      {activeMarker !== null && markers[activeMarker] && (
        <aside className="map-viewer__marker-panel">
          <h3 className="map-viewer__marker-title">{markers[activeMarker].label || 'Точка интереса'}</h3>
          <p className="map-viewer__marker-text">
            {markers[activeMarker].description || 'Описание точки можно добавить в поле markers в JSON.'}
          </p>
        </aside>
      )}

      {map.description && <p className="map-viewer__description">{map.description}</p>}
    </section>
  );
}
