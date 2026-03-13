import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/components/entity-modal.scss';

function renderField(label, value) {
  if (!value || (typeof value === 'string' && !value.trim())) return null;
  return (
    <div className="entity-modal__field" key={label}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function EntityModal({ open, title, image, fields = [], onClose, fullImage = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={`entity-modal ${fullImage ? 'entity-modal_full-image' : ''}`} role="dialog" aria-modal="true">
      <button className="entity-modal__overlay" type="button" onClick={onClose} aria-label="Закрыть модалку" />
      <div className="entity-modal__panel">
        <button className="entity-modal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {title && <h2 className="entity-modal__title">{title}</h2>}
        {image && (
          <div className="entity-modal__image-wrap">
            <img className="entity-modal__image" src={image} alt={title || ''} />
          </div>
        )}
        {fields.length > 0 && (
          <dl className="entity-modal__fields">
            {fields.map(({ label, value }) => renderField(label, value))}
          </dl>
        )}
      </div>
    </div>,
    document.body
  );
}
