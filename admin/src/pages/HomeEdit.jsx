import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from '../components/Settings';
import { saveFile } from '../services/githubApi';
import './HomeEdit.scss';

const EMPTY_HOME = {
  bannerEyebrow: '',
  bannerTitle: '',
  bannerLead: '',
  storyImage: '',
  storyTitle: '',
  storyDescription: '',
};

export default function HomeEdit() {
  const fetchData = useAdminStore((s) => s.fetchData);
  const raw = useAdminStore((s) => s.raw);
  const setHome = useAdminStore((s) => s.setHome);
  const setRaw = useAdminStore((s) => s.setRaw);
  const loading = useAdminStore((s) => s.loading);
  const error = useAdminStore((s) => s.error);

  const [draft, setDraft] = useState({ ...EMPTY_HOME });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const home = raw?.home;
    if (home && typeof home === 'object') {
      setDraft({ ...EMPTY_HOME, ...home });
    }
  }, [raw?.home]);

  const update = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const saveLocal = () => {
    setHome(draft);
    alert('Изменения сохранены. Нажмите «Сохранить в GitHub», чтобы отправить на сервер.');
  };

  const saveToGitHub = async () => {
    setHome(draft);
    const { owner, repo, token } = getStoredGitHub();
    if (!owner || !repo || !token) {
      alert('Заполните настройки GitHub (owner, repo, token) на странице Обзор.');
      return;
    }
    try {
      const payload = useAdminStore.getState().raw;
      await saveFile({
        owner,
        repo,
        path: 'client/public/data/agents.json',
        content: JSON.stringify(payload, null, 2),
        message: 'Update home (main page)',
        token,
      });
      setRaw(payload);
      alert('Сохранено в GitHub.');
    } catch (e) {
      alert(`Ошибка: ${e.message}`);
    }
  };

  return (
    <div className="page page_home-edit">
      <h1 className="page__title">Главная страница</h1>
      <p className="page__muted">
        Текст баннера, блок «Описание приключения» и подпись к карте. Хроника и карта кампании берутся из разделов Хроники и Карты.
      </p>
      {loading && <p className="page__muted">Загрузка…</p>}
      {error && <p className="page__error">Ошибка загрузки данных.</p>}

      <section className="home-edit__section">
        <h2 className="home-edit__section-title">Баннер</h2>
        <label className="admin-edit__field">
          <span className="admin-edit__label">Подпись над заголовком (eyebrow)</span>
          <input
            type="text"
            value={draft.bannerEyebrow || ''}
            onChange={(e) => update('bannerEyebrow', e.target.value)}
            placeholder="Pathfinder 1e campaign journal"
          />
        </label>
        <label className="admin-edit__field">
          <span className="admin-edit__label">Заголовок баннера</span>
          <input
            type="text"
            value={draft.bannerTitle || ''}
            onChange={(e) => update('bannerTitle', e.target.value)}
            placeholder="War for the Crown"
          />
        </label>
        <label className="admin-edit__field">
          <span className="admin-edit__label">Текст под заголовком (lead)</span>
          <textarea
            rows={3}
            value={draft.bannerLead || ''}
            onChange={(e) => update('bannerLead', e.target.value)}
            placeholder="Краткое описание кампании"
          />
        </label>
      </section>

      <section className="home-edit__section">
        <h2 className="home-edit__section-title">Описание приключения</h2>
        <label className="admin-edit__field">
          <span className="admin-edit__label">Ссылка на изображение</span>
          <input
            type="url"
            value={draft.storyImage || ''}
            onChange={(e) => update('storyImage', e.target.value)}
            placeholder="https://..."
          />
        </label>
        <label className="admin-edit__field">
          <span className="admin-edit__label">Заголовок блока</span>
          <input
            type="text"
            value={draft.storyTitle || ''}
            onChange={(e) => update('storyTitle', e.target.value)}
            placeholder="Пролог: тени над Талдором"
          />
        </label>
        <label className="admin-edit__field">
          <span className="admin-edit__label">Описание (текст)</span>
          <textarea
            rows={5}
            value={draft.storyDescription || ''}
            onChange={(e) => update('storyDescription', e.target.value)}
            placeholder="Текст описания приключения"
          />
        </label>
      </section>

      <div className="home-edit__actions">
        <button type="button" className="admin-modal__button admin-modal__button_save" onClick={saveLocal}>
          Сохранить локально
        </button>
        <button type="button" className="admin-modal__button admin-modal__button_save" onClick={saveToGitHub}>
          Сохранить в GitHub
        </button>
      </div>
    </div>
  );
}
