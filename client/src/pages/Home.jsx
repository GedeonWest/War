import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDataStore } from '../store/useDataStore';
import '../styles/pages/home.scss';

export default function Home() {
  const symbolUrl = `${import.meta.env.BASE_URL}assets/images/Taldor_symbol.webp`;
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);

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
    </div>
  );
}
