import '../styles/components/agent-card.scss';

function formatName(item) {
  const parts = [item.announce, item.title, item.name, item.surname].filter(Boolean);
  return parts.join(' ').trim() || '—';
}

export default function AgentCard({ item, category }) {
  const name = formatName(item);

  return (
    <article className="agent-card">
      <div className="agent-card__media">
        {item.imgref ? (
          <img
            className="agent-card__img"
            src={item.imgref}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="agent-card__placeholder" />
        )}
      </div>
      <div className="agent-card__body">
        <h2 className="agent-card__title">{name}</h2>
        {category && (
          <span className="agent-card__category">{category}</span>
        )}
        {item.attitude && (
          <p className="agent-card__attitude">
            <span className="agent-card__label">Отношение:</span> {item.attitude}
          </p>
        )}
        {item.appearance && item.appearance.trim() && (
          <p className="agent-card__text">
            <span className="agent-card__label">Внешность:</span> {item.appearance}
          </p>
        )}
        {item.background && item.background.trim() && (
          <p className="agent-card__text agent-card__text_collapse">
            <span className="agent-card__label">Предыстория:</span> {item.background}
          </p>
        )}
        {item.death && item.death.trim() && item.death.toLowerCase() !== 'alive' && (
          <p className="agent-card__death">
            <span className="agent-card__label">Смерть:</span> {item.death}
          </p>
        )}
      </div>
    </article>
  );
}
