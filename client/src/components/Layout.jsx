import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import '../styles/components/layout.scss';

const navItems = [
  { path: '/', label: 'Главная' },
  { path: '/agents', label: 'Агенты' },
  { path: '/dossiers', label: 'Досье' },
  { path: '/deceased', label: 'Погибшие' },
  { path: '/resources', label: 'Ресурсы' },
  { path: '/maps', label: 'Карты' },
  { path: '/chronicles', label: 'Хроники' },
  { path: '/players', label: 'Игроки' },
  { path: '/initiative', label: 'Инициатива' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const logoUrl = `${import.meta.env.BASE_URL}assets/images/logo.png`;
  const fetchData = useDataStore((s) => s.fetchData);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = (location.pathname.replace(new RegExp(`^${base}`), '') || '/').replace(/\/$/, '') || '/';

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [menuOpen]);

  return (
    <div className="app">
      <header className="layout__header">
        <div className="layout__brand">
          <img src={logoUrl} alt="War for the Crown" className="layout__brand-logo" />
          <button
            type="button"
            className={`layout__menu-toggle ${menuOpen ? 'layout__menu-toggle_active' : ''}`}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="layout__menu-toggle-line" />
            <span className="layout__menu-toggle-line" />
            <span className="layout__menu-toggle-line" />
          </button>
        </div>
        <nav className={`layout__nav ${menuOpen ? 'layout__nav_open' : ''}`}>
          {navItems.map(({ path, label }) => {
            const pathNorm = path.replace(/\/$/, '') || '/';
            const isActive = currentPath === pathNorm;
            return (
              <Link
                key={path}
                to={path}
                className={`layout__nav-link ${isActive ? 'layout__nav-link_active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <button
        type="button"
        className={`layout__backdrop ${menuOpen ? 'layout__backdrop_visible' : ''}`}
        aria-hidden={!menuOpen}
        aria-label="Закрыть меню"
        onClick={() => setMenuOpen(false)}
      />
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <a href={`${base}/admin/`} className="layout__admin-link" rel="noopener noreferrer">
          Админка
        </a>
        <p className="layout__copyright">
          https://gedeonwest.github.io/War uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo&apos;s
          {' '}
          Community Use Policy
          {' '}
          (<a href="https://paizo.com" target="_blank" rel="noopener noreferrer">paizo.com</a>).
          {' '}
          This includes images and maps from the War for the Crown Adventure Path. We are expressly prohibited
          from charging you to use or access this content. https://gedeonwest.github.io/War is not published, endorsed, or
          specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, visit
          {' '}
          <a href="https://paizo.com" target="_blank" rel="noopener noreferrer">paizo.com</a>.
        </p>
      </footer>
    </div>
  );
}
