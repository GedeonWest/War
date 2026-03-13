import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDataStore } from '../store/useDataStore';
import '../styles/components/layout.scss';

const navItems = [
  { path: '/', label: 'Главная' },
  { path: '/agents', label: 'Агенты' },
  { path: '/dossiers', label: 'Досье' },
  { path: '/deceased', label: 'Погибшие' },
  { path: '/resources', label: 'Ресурсы' },
  { path: '/maps', label: 'Карты' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const logoUrl = `${import.meta.env.BASE_URL}assets/images/logo.png`;
  const fetchData = useDataStore((s) => s.fetchData);
  const currentPath = (location.pathname.replace(new RegExp(`^${base}`), '') || '/').replace(/\/$/, '') || '/';

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="app">
      <header className="layout__header">
        <div className="layout__brand">
          <img src={logoUrl} alt="War for the Crown" className="layout__brand-logo" />
        </div>
        <nav className="layout__nav">
          {navItems.map(({ path, label }) => {
            const pathNorm = path.replace(/\/$/, '') || '/';
            const isActive = currentPath === pathNorm;
            return (
              <Link
                key={path}
                to={path}
                className={`layout__nav-link ${isActive ? 'layout__nav-link_active' : ''}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <a href={`${base}/admin/`} className="layout__admin-link" rel="noopener noreferrer">
          Админка
        </a>
      </footer>
    </div>
  );
}
