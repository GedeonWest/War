import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import AgentCard from '../components/AgentCard';
import EntityModal from '../components/EntityModal';
import '../styles/pages/agents.scss';

const CATEGORY_LABELS = {
  npcs: 'НПС',
  artifacts: 'Артефакты',
  active: 'Активные',
  agent: 'Агенты',
  crown: 'Корона',
  secrown: 'Претенденты на корону',
  target: 'Цели',
  inactive: 'Неактивные',
  legacy: 'Наследие',
  prison: 'В заключении',
};

export default function Agents() {
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => {
    if (!raw) return [];
    return Object.entries(raw)
      .filter(([key]) => ['npcs', 'artifacts', 'active', 'agent', 'crown', 'secrown', 'target', 'inactive', 'legacy', 'prison'].includes(key))
      .map(([key, list]) => ({ key, label: CATEGORY_LABELS[key] || key, list: list || [] }));
  }, [raw]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return categories;
    const q = filter.toLowerCase().trim();
    return categories.map(({ key, label, list }) => ({
      key,
      label,
      list: list.filter(
        (item) =>
          [item.name, item.surname, item.title, item.announce, item.background].some(
            (v) => typeof v === 'string' && v.toLowerCase().includes(q)
          )
      ),
    }));
  }, [categories, filter]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_agents arcane-glow">
      <h1 className="page__title">Агенты</h1>
      <div className="agents__toolbar">
        <input
          type="search"
          className="agents__search"
          placeholder="Поиск по имени, титулу, предыстории…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {filtered.map(({ key, label, list }) => (
        <section key={key} className="agents__section">
          <h2 className="agents__section-title">
            <span>{label}</span>
            <em className="agents__section-count">{list.length}</em>
          </h2>
          <ul className="agents__list">
            {list.map((item, i) => (
              <li key={i} className="agents__item">
                <AgentCard item={item} category={label} onClick={() => setSelected({ item, label })} />
              </li>
            ))}
          </ul>
          {list.length === 0 && <p className="page__muted">Нет записей.</p>}
        </section>
      ))}
      <EntityModal
        open={Boolean(selected)}
        title={selected ? `${selected.label}: ${selected.item.name || selected.item.title || selected.item.surname || 'Запись'}` : ''}
        image={selected ? (selected.item.imgref || selected.item.image) : ''}
        onClose={() => setSelected(null)}
        fields={
          selected
            ? [
                { label: 'Статус', value: selected.item.status },
                { label: 'Роль', value: selected.item.role || selected.item.title },
                { label: 'Отношение', value: selected.item.attitude },
                { label: 'Кратко', value: selected.item.summary || selected.item.shortDescription || selected.item.appearance },
                { label: 'Описание', value: selected.item.description || selected.item.background || selected.item.details || selected.item.longDescription },
                { label: 'Навыки', value: selected.item.skills },
                { label: 'Сильные стороны', value: selected.item.strengths },
                { label: 'Слабости', value: selected.item.weakness },
                { label: 'Смерть', value: selected.item.death },
              ]
            : []
        }
      />
    </div>
  );
}
