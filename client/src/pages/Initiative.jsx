import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import '../styles/pages/initiative.scss';

const DRAG_THRESHOLD_PX = 10;

function getItemIdFromElement(el) {
  let node = el;
  while (node && node !== document.body) {
    if (node.dataset?.initiativeItemId) return node.dataset.initiativeItemId;
    node = node.parentElement;
  }
  return null;
}

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
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchDragActiveRef = useRef(false);
  const dragOverIdRef = useRef(null);
  dragOverIdRef.current = dragOverId;

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

  const handleDrop = useCallback((targetId) => {
    if (!dragId) return;
    setParticipants((current) => moveItem(current, dragId, targetId));
    setDragId(null);
    setDragOverId(null);
  }, [dragId]);

  const handleTouchStart = useCallback((id, e) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDragActiveRef.current = false;
    setDragId(id);
  }, []);

  useEffect(() => {
    if (dragId == null) return;

    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const { clientX, clientY } = e.touches[0];
      if (!touchDragActiveRef.current) {
        const dx = Math.abs(clientX - touchStartRef.current.x);
        const dy = Math.abs(clientY - touchStartRef.current.y);
        if (dx > dy || (dx <= DRAG_THRESHOLD_PX && dy <= DRAG_THRESHOLD_PX)) return;
        touchDragActiveRef.current = true;
      }
      e.preventDefault();
      const target = document.elementFromPoint(clientX, clientY);
      const targetId = getItemIdFromElement(target);
      setDragOverId((prev) => (targetId !== prev ? targetId : prev));
    };

    const onTouchEnd = (e) => {
      if (e.changedTouches.length !== 1) return;
      const overId = dragOverIdRef.current;
      if (touchDragActiveRef.current && overId && overId !== dragId) {
        setParticipants((current) => moveItem(current, dragId, overId));
      }
      setDragId(null);
      setDragOverId(null);
      touchDragActiveRef.current = false;
      document.removeEventListener('touchmove', onTouchMove, { passive: false });
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchmove', onTouchMove, { passive: false });
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragId, dragOverId]);

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
              data-initiative-item-id={item.id}
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
              onTouchStart={(e) => handleTouchStart(item.id, e)}
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
