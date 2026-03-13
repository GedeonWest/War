import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
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
          Не удалось загрузить данные. Убедитесь, что клиент задеплоен и доступен по тому же домену, или добавьте данные через «Агенты» и сохраните в репозиторий.
        </p>
      )}
      {raw && !error && (
        <p className="page__muted">
          Данные загружены. Используйте меню слева для редактирования разделов. После изменений нажмите «Сохранить в GitHub» в форме или на странице списка.
        </p>
      )}
      <p>
        <Link to={`${base}/agents/active`}>Агенты (активные)</Link> ·{' '}
        <Link to={`${base}/resources`}>Ресурсы</Link> ·{' '}
        <Link to={`${base}/maps`}>Карты</Link>
      </p>
    </div>
  );
}
