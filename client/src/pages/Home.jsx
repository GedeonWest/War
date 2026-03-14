import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDataStore } from '../store/useDataStore';
import '../styles/pages/home.scss';

export default function Home() {
  const baseUrl = import.meta.env.BASE_URL;
  const symbolUrl = `${baseUrl}assets/images/Taldor_symbol.webp`;
  const logoUrl = `${baseUrl}assets/images/logo.png`;
  const wallUrl = `${baseUrl}assets/images/wall.jpg`;
  const fetchData = useDataStore((s) => s.fetchData);
  const raw = useDataStore((s) => s.raw);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const featuredCharacter = useMemo(() => {
    const source = raw?.npcs?.[0] || raw?.active?.[0] || raw?.agent?.[0] || null;
    return {
      name: source?.name || 'Лорд-наблюдатель Эйрен Восс',
      role: source?.role || source?.status || 'Связной Имперского Двора',
      text: source?.description || source?.shortDescription
        || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat vulputate mi, in pulvinar sem posuere in. Cras porttitor sem vel dolor volutpat vulputate.',
      image: source?.imgref || source?.image || logoUrl,
    };
  }, [raw, logoUrl]);

  const featuredMap = useMemo(() => {
    const source = raw?.maps?.[0] || null;
    return {
      title: source?.title || source?.name || 'Карта северных рубежей',
      location: source?.location || 'Прибрежные земли Талдора',
      text: source?.description || source?.shortDescription
        || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non pulvinar enim. Fusce fermentum, libero sit amet luctus bibendum, lorem dui tincidunt tortor.',
      image: source?.imgref || source?.image || wallUrl,
    };
  }, [raw, wallUrl]);

  return (
    <div className="page page_home">
      <section className="hero-book">
        <div className="hero-book__left">
          <p className="hero-book__eyebrow">Хроники кампании</p>
          <h1 className="page__title hero-book__title">War for the Crown</h1>
          <p className="hero-book__lead">
            Справочник по кампании Pathfinder 1e: агенты, досье, погибшие, ресурсы и карты.
          </p>
          <p className="hero-book__text">
            В хрониках Талдора каждая встреча оставляет след: имена союзников и врагов, тайные
            досье, утраченные души и ключевые ресурсы экспедиции. Этот свод страниц помогает
            держать нить повествования и видеть всю кампанию как единую летопись.
          </p>
        </div>
        <div className="hero-book__right">
          <div className="hero-book__crest-frame">
            <img src={symbolUrl} alt="Символ Талдора" className="hero-book__crest" />
          </div>
        </div>
      </section>

      <div className="hero-book__status">
        {loading && <p className="page__muted">Загрузка данных…</p>}
        {error && <p className="page__error">Ошибка: {error}</p>}
      </div>

      <nav className="home-nav">
        <Link to="/agents" className="home-nav__link arcane-button">
          <Icon icon="game-icons:broadsword" className="arcane-button__icon" />
          Агенты
        </Link>
        <Link to="/dossiers" className="home-nav__link arcane-button">
          <Icon icon="game-icons:crown" className="arcane-button__icon" />
          Досье
        </Link>
        <Link to="/deceased" className="home-nav__link arcane-button">
          <Icon icon="game-icons:checked-shield" className="arcane-button__icon" />
          Погибшие
        </Link>
        <Link to="/resources" className="home-nav__link arcane-button">
          <Icon icon="game-icons:scroll-unfurled" className="arcane-button__icon" />
          Ресурсы
        </Link>
        <Link to="/maps" className="home-nav__link arcane-button">
          <Icon icon="game-icons:treasure-map" className="arcane-button__icon" />
          Карты
        </Link>
      </nav>

      <section className="home-showcase">
        <article className="home-showcase__panel home-showcase__panel_character">
          <header className="home-showcase__header">
            <Icon icon="game-icons:spartan-helmet" className="home-showcase__icon" />
            <h2>Главный персонаж</h2>
          </header>
          <div className="home-showcase__media">
            <img src={featuredCharacter.image} alt={featuredCharacter.name} loading="lazy" />
          </div>
          <h3>{featuredCharacter.name}</h3>
          <p className="home-showcase__meta">{featuredCharacter.role}</p>
          <p>{featuredCharacter.text}</p>
        </article>

        <article className="home-showcase__panel home-showcase__panel_map">
          <header className="home-showcase__header">
            <Icon icon="game-icons:treasure-map" className="home-showcase__icon" />
            <h2>Актуальная карта</h2>
          </header>
          <div className="home-showcase__media">
            <img src={featuredMap.image} alt={featuredMap.title} loading="lazy" />
          </div>
          <h3>{featuredMap.title}</h3>
          <p className="home-showcase__meta">{featuredMap.location}</p>
          <p>{featuredMap.text}</p>
        </article>
      </section>

      <section className="home-ornaments">
        <article className="home-ornaments__item">
          <Icon icon="game-icons:ornate-cross" className="home-ornaments__icon" />
          <h3>Архив миссий</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc hendrerit, lorem id
            faucibus malesuada, urna erat convallis dui, non scelerisque nunc lacus non turpis.
          </p>
        </article>
        <article className="home-ornaments__item">
          <Icon icon="game-icons:castle" className="home-ornaments__icon" />
          <h3>Политический фон</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae sapien vel
            turpis gravida dictum. Cras eget tempor lorem, et feugiat eros.
          </p>
        </article>
        <article className="home-ornaments__item">
          <Icon icon="game-icons:scroll-unfurled" className="home-ornaments__icon" />
          <h3>Летопись отряда</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac elementum
            sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.
          </p>
        </article>
      </section>
    </div>
  );
}
