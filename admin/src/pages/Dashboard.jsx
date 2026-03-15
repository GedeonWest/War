import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import Settings from '../components/Settings';

export default function Dashboard() {
  const fetchData = useAdminStore((s) => s.fetchData);
  const loading = useAdminStore((s) => s.loading);
  const error = useAdminStore((s) => s.error);
  const raw = useAdminStore((s) => s.raw);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="page">
      <h1 className="page__title">Обзор</h1>
      <Settings />
      {loading && <p className="page__muted">Загрузка данных с клиента…</p>}
      {error && (
        <p className="page__error">
          Не удалось загрузить данные. Проверьте, что клиент доступен по тому же домену и путь к `data/agents.json` корректен.
        </p>
      )}
      {raw && !error && (
        <p className="page__muted">
          Данные загружены. Используйте разделы слева: НПС, Артефакты, Материалы, Карты, Хроники и Игроки.
        </p>
      )}
      <div className="dashboard-links">
        <Link to="/home" className="dashboard-links__item">Главная</Link>
        <Link to="/npcs" className="dashboard-links__item">НПС</Link>
        <Link to="/artifacts" className="dashboard-links__item">Артефакты</Link>
        <Link to="/materials" className="dashboard-links__item">Материалы</Link>
        <Link to="/maps" className="dashboard-links__item">Карты</Link>
        <Link to="/chronicles" className="dashboard-links__item">Хроники</Link>
        <Link to="/players" className="dashboard-links__item">Игроки</Link>
      </div>
    </div>
  );
}
