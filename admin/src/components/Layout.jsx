import { Link, useParams } from 'react-router-dom';
import '../styles/components/layout.scss';

const CATEGORIES = [
  { key: 'active', label: 'Активные' },
  { key: 'agent', label: 'Агенты' },
  { key: 'crown', label: 'Корона' },
  { key: 'secrown', label: 'Претенденты на корону' },
  { key: 'target', label: 'Цели' },
  { key: 'inactive', label: 'Неактивные' },
  { key: 'legacy', label: 'Наследие' },
  { key: 'prison', label: 'В заключении' },
  { key: 'dead', label: 'Погибшие' },
  { key: 'dpc', label: 'DPC' },
  { key: 'pc', label: 'PC' },
];

export default function Layout({ children }) {
  const { category } = useParams();

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
            {CATEGORIES.map(({ key, label }) => (
              <Link
                key={key}
                to={`/agents/${key}`}
                className={`admin-layout__nav-link ${category === key ? 'admin-layout__nav-link_active' : ''}`}
              >
                {label}
              </Link>
            ))}
            <Link to="/resources" className="admin-layout__nav-link">
              Ресурсы
            </Link>
            <Link to="/maps" className="admin-layout__nav-link">
              Карты
            </Link>
          </nav>
        </aside>
        <main className="admin-layout__main">{children}</main>
      </div>
    </div>
  );
}
