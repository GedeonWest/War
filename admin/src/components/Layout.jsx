import { Link, useLocation } from 'react-router-dom';
import '../styles/components/layout.scss';

const SECTIONS = [
  { path: '/npcs', label: 'НПС' },
  { path: '/artifacts', label: 'Артефакты' },
  { path: '/materials', label: 'Материалы' },
  { path: '/maps', label: 'Карты' },
  { path: '/chronicles', label: 'Хроники' },
  { path: '/players', label: 'Игроки' },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="admin-layout">
      <header className="admin-layout__header">
        <Link to="/" className="admin-layout__brand">
          Админка
        </Link>
        <Link to="/" className="admin-layout__link">
          Обзор
        </Link>
      </header>
      <div className="admin-layout__body">
        <aside className="admin-layout__aside">
          <nav className="admin-layout__nav">
            {SECTIONS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`admin-layout__nav-link ${pathname.startsWith(path) ? 'admin-layout__nav-link_active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="admin-layout__main">{children}</main>
      </div>
    </div>
  );
}
