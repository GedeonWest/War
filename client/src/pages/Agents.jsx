import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import AgentCard from '../components/AgentCard';
import CardMasonry from '../components/CardMasonry';
import EntityModal from '../components/EntityModal';
import '../styles/pages/agents.scss';

const AGENT_CATEGORY_KEYS = ['npcs', 'active', 'agent', 'crown', 'secrown', 'inactive', 'prison'];

const CATEGORY_LABELS = {
  npcs: '',
  active: 'Активные',
  agent: 'Агенты',
  crown: 'Корона',
  secrown: 'Претенденты на корону',
  inactive: 'Неактивные',
  prison: 'В заключении',
};

function flattenAgents(raw) {
  if (!raw) return [];
  return AGENT_CATEGORY_KEYS.flatMap((key) => {
    const list = raw[key];
    if (!Array.isArray(list)) return [];
    return (list || []).map((item) => ({ ...item, _sourceCategory: key }));
  });
}

function getCategoryLabel(item) {
  const key = item.category || item._sourceCategory;
  return CATEGORY_LABELS[key] || key || '';
}

export default function Agents() {
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const [textFilter, setTextFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const allAgents = useMemo(() => flattenAgents(raw), [raw]);

  const categoriesForFilter = useMemo(() => {
    return AGENT_CATEGORY_KEYS.filter((key) => key !== 'npcs').map((key) => ({ value: key, label: CATEGORY_LABELS[key] || key }));
  }, []);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(allAgents.map((a) => a.status).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'ru'));
    return statuses.map((s) => ({ value: s, label: s }));
  }, [allAgents]);

  const filteredAgents = useMemo(() => {
    let list = allAgents;
    const q = textFilter.trim().toLowerCase();
    if (q) {
      list = list.filter((item) =>
        [item.name, item.surname, item.title, item.announce, item.background].some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q)
        )
      );
    }
    if (categoryFilter) {
      const key = categoryFilter;
      list = list.filter((item) => (item.category || item._sourceCategory) === key);
    }
    if (statusFilter) {
      list = list.filter((item) => (item.status || '') === statusFilter);
    }
    return list;
  }, [allAgents, textFilter, categoryFilter, statusFilter]);

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
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
        />
        <select
          className="agents__filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Фильтр по категории"
        >
          <option value="">Все категории</option>
          {categoriesForFilter.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          className="agents__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Фильтр по статусу"
        >
          <option value="">Все статусы</option>
          {statusOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      {filteredAgents.length === 0 ? (
        <p className="page__muted">Нет записей по выбранным фильтрам.</p>
      ) : (
        <CardMasonry className="agents__list">
          {filteredAgents.map((item, i) => (
            <div key={`${item.id || item.name || i}-${i}`} className="agents__item">
              <AgentCard
                item={item}
                category={item.category || item._sourceCategory}
                onClick={() => setSelected({ item, label: getCategoryLabel(item) })}
              />
            </div>
          ))}
        </CardMasonry>
      )}
      <EntityModal
        open={Boolean(selected)}
        title={selected ? (getCategoryLabel(selected.item) ? `${getCategoryLabel(selected.item)}: ` : '') + (selected.item.name || selected.item.title || selected.item.surname || 'Запись') : ''}
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
