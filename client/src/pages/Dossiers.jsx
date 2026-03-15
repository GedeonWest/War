import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import AgentCard from '../components/AgentCard';
import CardMasonry from '../components/CardMasonry';
import EntityModal from '../components/EntityModal';
import { formatName } from '../components/AgentCard';
import '../styles/pages/dossiers.scss';

export default function Dossiers() {
  const getDossiers = useDataStore((s) => s.getDossiers);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => getDossiers(), [getDossiers]);
  const filtered = useMemo(() => {
    if (!filter.trim()) return list;
    const q = filter.toLowerCase().trim();
    return list.filter(
      (item) =>
        [item.name, item.surname, item.title, item.announce, item.background, item.category].some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q)
        )
    );
  }, [list, filter]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_dossiers arcane-glow">
      <h1 className="page__title">Досье</h1>
      <div className="dossiers__toolbar">
        <input
          type="search"
          className="dossiers__search"
          placeholder="Поиск по досье…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <CardMasonry className="dossiers__list">
        {filtered.map((item, i) => (
          <div key={i} className="dossiers__item">
            <AgentCard item={item} category={item.category} onClick={() => setSelected(item)} />
          </div>
        ))}
      </CardMasonry>
      <p className="dossiers__count">Найдено записей: {filtered.length}</p>
      {filtered.length === 0 && <p className="page__muted">Нет записей.</p>}
      <EntityModal
        open={Boolean(selected)}
        title={selected ? formatName(selected) : ''}
        image={selected ? (selected.imgref || selected.image) : ''}
        onClose={() => setSelected(null)}
        fields={
          selected
            ? [
                { label: 'Категория', value: selected.category },
                { label: 'Статус', value: selected.status },
                { label: 'Роль', value: selected.role || selected.title },
                { label: 'Описание', value: selected.description || selected.background || selected.longDescription },
                { label: 'Кратко', value: selected.summary || selected.shortDescription || selected.appearance },
                { label: 'Навыки', value: selected.skills },
                { label: 'Смерть', value: selected.death },
              ]
            : []
        }
      />
    </div>
  );
}
