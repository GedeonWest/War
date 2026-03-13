import '../styles/components/agent-card.scss';

export function formatName(item) {
  const parts = [item.announce, item.title, item.name, item.surname].filter(Boolean);
  return parts.join(' ').trim() || item.title || item.name || '—';
}

function getShortText(item) {
  return item.summary || item.shortDescription || item.appearance || item.description || item.background || '';
}

export default function AgentCard({ item, category, onClick }) {
  const name = formatName(item);
  const shortText = getShortText(item);
  const image = item.imgref || item.image;

  return (
    <article className={`agent-card ${onClick ? 'agent-card_clickable' : ''}`}>
      <div className="agent-card__media">
        {image ? (
          <img
            className="agent-card__img"
            src={image}
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
        {item.role && <p className="agent-card__attitude">{item.role}</p>}
        {item.attitude && !item.role && <p className="agent-card__attitude">Отношение: {item.attitude}</p>}
        {shortText && <p className="agent-card__text agent-card__text_collapse">{shortText}</p>}
        {item.death && item.death.trim() && item.death.toLowerCase() !== 'alive' && (
          <p className="agent-card__death">Смерть: {item.death}</p>
        )}
        {onClick && (
          <button type="button" className="arcane-button agent-card__action" onClick={onClick}>
            Подробнее
          </button>
        )}
      </div>
    </article>
  );
}
