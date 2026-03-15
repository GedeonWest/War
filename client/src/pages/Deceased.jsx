import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import AgentCard from '../components/AgentCard';
import CardMasonry from '../components/CardMasonry';
import EntityModal from '../components/EntityModal';
import { formatName } from '../components/AgentCard';
import '../styles/pages/deceased.scss';

export default function Deceased() {
  const getDeceased = useDataStore((s) => s.getDeceased);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => getDeceased(), [getDeceased]);
  const filtered = useMemo(() => {
    if (!filter.trim()) return list;
    const q = filter.toLowerCase().trim();
    return list.filter(
      (item) =>
        [item.name, item.surname, item.death, item.background].some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q)
        )
    );
  }, [list, filter]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_deceased arcane-glow">
      <h1 className="page__title">Погибшие</h1>
      <div className="deceased__toolbar">
        <input
          type="search"
          className="deceased__search"
          placeholder="Поиск…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <CardMasonry className="deceased__list">
        {filtered.map((item, i) => (
          <div key={i} className="deceased__item">
            <AgentCard item={item} onClick={() => setSelected(item)} />
          </div>
        ))}
      </CardMasonry>
      <p className="deceased__count">Найдено записей: {filtered.length}</p>
      {filtered.length === 0 && <p className="page__muted">Нет записей.</p>}
      <EntityModal
        open={Boolean(selected)}
        title={selected ? formatName(selected) : ''}
        image={selected ? (selected.imgref || selected.image) : ''}
        onClose={() => setSelected(null)}
        fields={
          selected
            ? [
                { label: 'Статус', value: selected.status },
                { label: 'Причина смерти', value: selected.death },
                { label: 'Описание', value: selected.description || selected.background || selected.longDescription },
                { label: 'Детали', value: selected.summary || selected.shortDescription || selected.appearance },
              ]
            : []
        }
      />
    </div>
  );
}
