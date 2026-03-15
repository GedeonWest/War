import { useEffect, useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import '../styles/pages/home.scss';

function sortChronicles(items) {
  return [...(items || [])].sort((a, b) => {
    const aOrder = Number(a.order ?? a.chapter ?? 0);
    const bOrder = Number(b.order ?? b.chapter ?? 0);
    if (!Number.isNaN(aOrder) && !Number.isNaN(bOrder) && aOrder !== bOrder) return aOrder - bOrder;
    return String(a.title || '').localeCompare(String(b.title || ''), 'ru');
  });
}

export default function Home() {
  const fetchData = useDataStore((s) => s.fetchData);
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);

  const baseUrl = import.meta.env.BASE_URL;
  const symbolUrl = `${baseUrl}assets/images/Taldor_symbol.webp`;
  const logoUrl = `${baseUrl}assets/images/logo.png`;
  const wallUrl = `${baseUrl}assets/images/wall.jpg`;

  const home = useMemo(() => (raw?.home && typeof raw.home === 'object' ? raw.home : {}), [raw?.home]);
  const chronicles = useMemo(
    () => sortChronicles(raw?.chronicles ?? []),
    [raw?.chronicles]
  );
  const mainMap = useMemo(() => {
    const maps = raw?.maps;
    return Array.isArray(maps) && maps.length > 0 ? maps[0] : null;
  }, [raw?.maps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const bannerEyebrow = home.bannerEyebrow ?? 'Pathfinder 1e campaign journal';
  const bannerTitle = home.bannerTitle ?? 'War for the Crown';
  const bannerLead = home.bannerLead ?? '';
  const storyImage = home.storyImage?.trim() || logoUrl;
  const storyTitle = home.storyTitle?.trim() || '';
  const storyDescription = (home.storyDescription || '').trim();
  const storyParagraphs = storyDescription ? storyDescription.split(/\n\n+/).filter(Boolean) : [];

  if (loading) {
    return (
      <div className="page page_home">
        <p className="page__muted">Загрузка…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="page page_home">
        <p className="page__error">Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <div className="page page_home">
      <section className="home-banner">
        <img src={wallUrl} alt="" className="home-banner__bg" />
        <div className="home-banner__overlay" />
        <div className="home-banner__layout">
          <div className="home-banner__content">
            {bannerEyebrow && <p className="home-banner__eyebrow">{bannerEyebrow}</p>}
            <h1 className="home-banner__title">{bannerTitle}</h1>
            {bannerLead && <p className="home-banner__lead">{bannerLead}</p>}
          </div>

          <div className="home-banner__crest-wrap">
            <div className="home-banner__crest-frame">
              <img src={symbolUrl} alt="Герб Талдора" className="home-banner__crest" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-story">
        <figure className="home-story__media">
          <img src={storyImage} alt="" loading="lazy" />
        </figure>
        <article className="home-story__content">
          <p className="home-story__eyebrow">Описание приключения</p>
          {storyTitle && <h2>{storyTitle}</h2>}
          {storyParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
      </section>

      <section className="home-chronicle">
        <header className="home-chronicle__header">
          <p className="home-chronicle__eyebrow">Хроника похода</p>
          <h2>Ключевые события кампании</h2>
        </header>
        {chronicles.length === 0 ? (
          <p className="page__muted">Хроник пока нет. Добавьте их в разделе Хроники.</p>
        ) : (
          <ol className="home-chronicle__list">
            {chronicles.map((item, index) => (
              <li key={`${item.title || 'ch'}-${index}`} className="home-chronicle__item">
                <h3>{item.chapter ? `Глава ${item.chapter}. ` : ''}{item.title || 'Без названия'}</h3>
                <p>{item.summary || item.description || ''}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="home-map">
        {mainMap?.imgref ? (
          <>
            <img
              src={mainMap.imgref}
              alt={mainMap.title || 'Карта кампании'}
              className="home-map__image"
              loading="lazy"
            />
            <div className="home-map__caption">
              <h2>{mainMap.title || 'Карта кампании'}</h2>
              {(mainMap.shortDescription || mainMap.description) && (
                <p>{mainMap.shortDescription || mainMap.description}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="home-map__placeholder" aria-label="Карта будет добавлена позже">
              <span>Карта кампании будет добавлена позже</span>
            </div>
            <div className="home-map__caption">
              <h2>Карта кампании</h2>
              <p>Добавьте карту в разделе Карты в админке.</p>
            </div>
          </>
        )}
      </section>

      <section className="home-notes">
        <article className="home-notes__item">
          <h3>Герои и союзники</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet consequat
            velit, vitae tincidunt sem.
          </p>
        </article>
        <article className="home-notes__item">
          <h3>Политические интриги</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque suscipit lorem et
            lacus consequat, ut sagittis massa interdum.
          </p>
        </article>
        <article className="home-notes__item">
          <h3>Цели экспедиции</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce faucibus enim nec
            sem lobortis, in facilisis sem finibus.
          </p>
        </article>
      </section>
    </div>
  );
}
