import { Link } from 'react-router-dom';
import '../styles/pages/home.scss';

export default function Home() {
  const baseUrl = import.meta.env.BASE_URL;
  const symbolUrl = `${baseUrl}assets/images/Taldor_symbol.webp`;
  const logoUrl = `${baseUrl}assets/images/logo.png`;
  const wallUrl = `${baseUrl}assets/images/wall.jpg`;

  return (
    <div className="page page_home">
      <section className="home-banner">
        <img src={wallUrl} alt="" className="home-banner__bg" />
        <div className="home-banner__overlay" />
        <div className="home-banner__content">
          <p className="home-banner__eyebrow">Pathfinder 1e campaign journal</p>
          <h1 className="home-banner__title">War for the Crown</h1>
          <p className="home-banner__lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem non est
            cursus tincidunt. Sed in mauris eu nisi bibendum volutpat vitae et neque.
          </p>
          <nav className="home-banner__nav">
            <Link to="/agents" className="arcane-button">Агенты</Link>
            <Link to="/dossiers" className="arcane-button">Досье</Link>
            <Link to="/deceased" className="arcane-button">Погибшие</Link>
            <Link to="/resources" className="arcane-button">Ресурсы</Link>
            <Link to="/maps" className="arcane-button">Карты</Link>
          </nav>
        </div>
      </section>

      <section className="home-story">
        <figure className="home-story__media">
          <img src={logoUrl} alt="Герб экспедиции" loading="lazy" />
        </figure>
        <article className="home-story__content">
          <p className="home-story__eyebrow">Описание приключения</p>
          <h2>Пролог: тени над Талдором</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper ultricies
            ligula, et suscipit mauris aliquet id. Integer non sapien pretium, posuere turpis
            non, ultrices justo. Aliquam vel nibh eros. Suspendisse porta diam lorem.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et augue a arcu
            faucibus semper. Curabitur volutpat justo in lorem posuere, eget feugiat neque
            interdum. Integer dictum dolor non leo tempor malesuada.
          </p>
        </article>
      </section>

      <section className="home-chronicle">
        <header className="home-chronicle__header">
          <p className="home-chronicle__eyebrow">Хроника похода</p>
          <h2>Ключевые события кампании</h2>
        </header>
        <ol className="home-chronicle__list">
          <li className="home-chronicle__item">
            <h3>Глава I: Имперская аудиенция</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at dapibus arcu.
              Donec ac nisi eu sapien posuere lacinia.
            </p>
          </li>
          <li className="home-chronicle__item">
            <h3>Глава II: Дорога через рубежи</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium pulvinar
              diam, sed luctus neque facilisis in.
            </p>
          </li>
          <li className="home-chronicle__item">
            <h3>Глава III: Печать короны</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi luctus metus vitae
              tortor volutpat, sed faucibus elit ultricies.
            </p>
          </li>
        </ol>
      </section>

      <section className="home-map">
        <img src={symbolUrl} alt="Обзорная карта региона" className="home-map__image" loading="lazy" />
        <div className="home-map__caption">
          <h2>Карта кампании</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus facilisis iaculis
            urna, nec hendrerit dolor ultricies id.
          </p>
        </div>
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
