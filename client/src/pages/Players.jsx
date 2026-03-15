import { useMemo, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import CardMasonry from '../components/CardMasonry';
import '../styles/pages/players.scss';

const STATUS_LABELS = {
  alive: 'Жив',
  dead: 'Мертв',
  prison: 'В тюрьме',
};

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase().trim();
  if (!value) return '';
  if (['жив', 'alive'].includes(value)) return 'alive';
  if (['мертв', 'мёртв', 'dead'].includes(value)) return 'dead';
  if (['в тюрьме', 'тюрьма', 'prison'].includes(value)) return 'prison';
  return value;
}

export default function Players() {
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const players = useDataStore((s) => s.getByCategory('players')) || [];
  const [query, setQuery] = useState('');

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((item) => (
      [item.name, item.about, item.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    ));
  }, [players, query]);

  if (loading) return <div className="page"><p className="page__muted">Загрузка…</p></div>;
  if (error) return <div className="page"><p className="page__error">Ошибка: {error}</p></div>;

  return (
    <div className="page page_players">
      <h1 className="page__title">Персонажи игроков</h1>
      <div className="players__toolbar">
        <input
          type="search"
          className="players__search"
          placeholder="Поиск по имени, статусу, описанию…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filteredPlayers.length === 0 ? (
        <p className="page__muted">Персонажей пока нет.</p>
      ) : (
        <CardMasonry className="players__list">
          {filteredPlayers.map((item, index) => {
            const status = normalizeStatus(item.status);
            const statusLabel = STATUS_LABELS[status] || item.status || 'Не указан';
            return (
              <div key={`${item.name || 'player'}-${index}`} className="players__item">
                <article className="player-card">
                  <div className="player-card__media">
                    {item.image ? (
                      <img src={item.image} alt={item.name || 'Персонаж'} loading="lazy" />
                    ) : (
                      <div className="player-card__placeholder">Нет изображения</div>
                    )}
                  </div>
                  <div className="player-card__body">
                    <h2 className="player-card__name">{item.name || 'Без имени'}</h2>
                    <span className="player-card__tag">Персонаж игрока</span>
                    <div className="player-card__meta">
                      <span className={`player-card__status player-card__status_${status || 'unknown'}`}>
                        {statusLabel}
                      </span>
                      <span className="player-card__level">Уровень: {item.level || '—'}</span>
                    </div>
                    <p className="player-card__about">{item.about || 'Описание отсутствует.'}</p>
                    {item.pdf ? (
                      <a className="arcane-button player-card__pdf" href={item.pdf} download target="_blank" rel="noopener noreferrer">
                        Скачать PDF чарника
                      </a>
                    ) : (
                      <span className="player-card__pdf-missing">PDF не добавлен</span>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </CardMasonry>
      )}
    </div>
  );
}
