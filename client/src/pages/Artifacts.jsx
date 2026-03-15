import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import AgentCard from '../components/AgentCard';
import CardMasonry from '../components/CardMasonry';
import EntityModal from '../components/EntityModal';
import '../styles/pages/artifacts.scss';

export default function Artifacts() {
  const artifacts = useDataStore((s) => s.getByCategory('artifacts')) || [];
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return artifacts;
    return artifacts.filter((item) =>
      [item.name, item.type, item.rarity, item.shortDescription, item.description].some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(q)
      )
    );
  }, [artifacts, filter]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_artifacts arcane-glow">
      <h1 className="page__title">Артефакты</h1>
      <div className="artifacts__toolbar">
        <input
          type="search"
          className="artifacts__search"
          placeholder="Поиск по названию, типу, описанию…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="page__muted">Артефактов пока нет.</p>
      ) : (
        <CardMasonry className="artifacts__list">
          {filtered.map((item, i) => (
            <div key={`${item.name || 'art'}-${i}`} className="artifacts__item">
              <AgentCard
                item={{ ...item, title: item.name }}
                category="artifacts"
                onClick={() => setSelected(item)}
              />
            </div>
          ))}
        </CardMasonry>
      )}
      <EntityModal
        open={Boolean(selected)}
        title={selected?.name || 'Артефакт'}
        image={selected?.imgref || selected?.image}
        onClose={() => setSelected(null)}
        fields={
          selected
            ? [
                { label: 'Тип', value: selected.type },
                { label: 'Редкость', value: selected.rarity },
                { label: 'Статус', value: selected.status },
                { label: 'Описание', value: selected.description || selected.shortDescription },
                { label: 'Эффекты', value: selected.effects },
                { label: 'Детали', value: selected.details },
              ]
            : []
        }
      />
    </div>
  );
}
