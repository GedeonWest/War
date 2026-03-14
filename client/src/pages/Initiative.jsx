import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import '../styles/pages/initiative.scss';

const EMPTY_PLAYERS = [];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function insertByInitiative(list, nextItem) {
  const next = [...list];

  for (let i = 0; i < next.length; i += 1) {
    if (nextItem.initiative > next[i].initiative) {
      next.splice(i, 0, nextItem);
      return next;
    }
  }

  next.push(nextItem);
  return next;
}

function moveItem(list, fromId, toId) {
  const fromIndex = list.findIndex((item) => item.id === fromId);
  const toIndex = list.findIndex((item) => item.id === toId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return list;

  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function Initiative() {
  const players = useDataStore((s) => s.raw?.players ?? EMPTY_PLAYERS);
  const participants = useDataStore((s) => s.initiativeParticipants);
  const setParticipants = useDataStore((s) => s.setInitiativeParticipants);
  const clearParticipants = useDataStore((s) => s.clearInitiativeParticipants);
  const round = useDataStore((s) => s.initiativeRound ?? 1);
  const incrementRound = useDataStore((s) => s.incrementInitiativeRound);
  const setRound = useDataStore((s) => s.setInitiativeRound);
  const [name, setName] = useState('');
  const [isEnemy, setIsEnemy] = useState(false);
  const [initiative, setInitiative] = useState('');
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const canAdd = useMemo(() => {
    return name.trim().length > 0 && initiative !== '' && !Number.isNaN(Number(initiative));
  }, [name, initiative]);

  const playerNameOptions = useMemo(() => {
    return [...new Set(players.map((item) => String(item?.name || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
  }, [players]);

  const handleAdd = (event) => {
    event.preventDefault();
    if (!canAdd) return;

    const nextItem = {
      id: createId(),
      name: name.trim(),
      isEnemy,
      initiative: Number(initiative),
    };

    setParticipants(insertByInitiative(participants, nextItem));
    setName('');
    setIsEnemy(false);
    setInitiative('');
  };

  const handleDelete = (id) => {
    setParticipants(participants.filter((item) => item.id !== id));
  };

  const handleDragStart = (id) => {
    setDragId(id);
  };

  const handleDrop = (targetId) => {
    if (!dragId) return;
    setParticipants(moveItem(participants, dragId, targetId));
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="page page_initiative">
      <h1 className="page__title">Порядок хода по инициативе</h1>
      <p className="page__muted">
        Добавляй участников, вручную переставляй карточки, удаляй выбывших из боя.
      </p>
      <div className="initiative__actions">
        <div className="initiative__round">
          <span className="initiative__round-label">Раунд</span>
          <span className="initiative__round-value" aria-live="polite">{round}</span>
          <button
            type="button"
            className="initiative__round-next"
            onClick={incrementRound}
          >
            Следующий раунд
          </button>
          {round > 1 && (
            <button
              type="button"
              className="initiative__round-reset"
              onClick={() => setRound(1)}
            >
              Сбросить раунд
            </button>
          )}
        </div>
        <button
          type="button"
          className="initiative__finish-battle"
          onClick={clearParticipants}
          disabled={participants.length === 0}
        >
          Закончить бой
        </button>
      </div>

      <form className="initiative-form" onSubmit={handleAdd}>
        <label className="initiative-form__field">
          <span className="initiative-form__label">Имя</span>
          <input
            type="text"
            list="initiative-player-names"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Мириэль"
          />
        </label>
        <datalist id="initiative-player-names">
          {playerNameOptions.map((playerName) => (
            <option key={playerName} value={playerName} />
          ))}
        </datalist>

        <label className="initiative-form__field initiative-form__field_initiative">
          <span className="initiative-form__label">Инициатива</span>
          <input
            type="number"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            placeholder="0"
          />
        </label>

        <label className="initiative-form__enemy">
          <input
            type="checkbox"
            checked={isEnemy}
            onChange={(e) => setIsEnemy(e.target.checked)}
          />
          <span>Противник</span>
        </label>

        <button type="submit" className="arcane-button" disabled={!canAdd}>
          Добавить в порядок
        </button>
      </form>

      {participants.length === 0 ? (
        <p className="page__muted">Список пуст. Добавь первого участника.</p>
      ) : (
        <ul className="initiative-list">
          {participants.map((item) => (
            <li
              key={item.id}
              className={[
                'initiative-list__item',
                item.isEnemy ? 'initiative-list__item_enemy' : 'initiative-list__item_ally',
                dragOverId === item.id ? 'initiative-list__item_over' : '',
              ].join(' ')}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(item.id);
              }}
              onDragLeave={() => setDragOverId((current) => (current === item.id ? null : current))}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={() => {
                setDragId(null);
                setDragOverId(null);
              }}
            >
              <div className="initiative-list__content">
                <h2 className="initiative-list__name">{item.name}</h2>
                <p className="initiative-list__value">Инициатива: {item.initiative}</p>
              </div>
              <button
                type="button"
                className="initiative-list__remove"
                onClick={() => handleDelete(item.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
