import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from '../components/Settings';
import { saveFile } from '../services/githubApi';
import '../styles/pages/agent-list.scss';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function AgentList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const fetchData = useAdminStore((s) => s.fetchData);
  const raw = useAdminStore((s) => s.raw);
  const loading = useAdminStore((s) => s.loading);
  const getCategory = useAdminStore((s) => s.getCategory);
  const removeItem = useAdminStore((s) => s.removeItem);
  const setSaved = useAdminStore((s) => s.setSaved);

  const list = getCategory(category) || [];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveToGitHub = async () => {
    const { owner, repo, token } = getStoredGitHub();
    if (!owner || !repo || !token) {
      alert('Заполните настройки GitHub (Обзор → Настройки GitHub): owner, repo и токен.');
      return;
    }
    try {
      await saveFile({
        owner,
        repo,
        path: 'client/public/data/agents.json',
        content: JSON.stringify(raw, null, 2),
        message: `Update agents (${category})`,
        token,
      });
      setSaved(true);
      alert('Сохранено. Изменения появятся на клиенте после деплоя (1–2 мин).');
    } catch (e) {
      alert('Ошибка: ' + e.message);
    }
  };

  const handleRemove = (index) => {
    if (confirm('Удалить запись?')) removeItem(category, index);
  };

  if (loading) return <p className="page__muted">Загрузка…</p>;

  return (
    <div className="page agent-list">
      <h1 className="page__title">Агенты: {category}</h1>
      <div className="agent-list__toolbar">
        <Link to={`${base}/agents/${category}/new`} className="agent-list__btn agent-list__btn_primary">
          Добавить
        </Link>
        <button type="button" className="agent-list__btn" onClick={handleSaveToGitHub}>
          Сохранить в GitHub
        </button>
      </div>
      <ul className="agent-list__list">
        {list.map((item, index) => (
          <li key={index} className="agent-list__item">
            <span className="agent-list__name">
              {[item.announce, item.title, item.name, item.surname].filter(Boolean).join(' ') || '—'}
            </span>
            <Link to={`${base}/agents/${category}/${index}`} className="agent-list__link">
              Редактировать
            </Link>
            <button type="button" className="agent-list__btn agent-list__btn_danger" onClick={() => handleRemove(index)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="page__muted">Нет записей. Нажмите «Добавить».</p>}
    </div>
  );
}
