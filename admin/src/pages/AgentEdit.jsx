import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { getStoredGitHub } from '../components/Settings';
import { saveFile } from '../services/githubApi';
import '../styles/pages/agent-edit.scss';

const EMPTY_ITEM = {
  status: '',
  announce: '',
  title: '',
  name: '',
  surname: '',
  attitude: '',
  appearance: '',
  background: '',
  biases: '',
  strengths: '',
  weakness: '',
  skills: '',
  death: '',
  imgref: '',
};

const EXTRA_FIELDS = ['achievements', 'race', 'order', 'classes', 'camptrait', 'noblerank', 'persona'];

export default function AgentEdit() {
  const { category, index } = useParams();
  const navigate = useNavigate();
  const getCategory = useAdminStore((s) => s.getCategory);
  const addItem = useAdminStore((s) => s.addItem);
  const updateItem = useAdminStore((s) => s.updateItem);
  const raw = useAdminStore((s) => s.raw);
  const setSaved = useAdminStore((s) => s.setSaved);

  const isNew = index === 'new';
  const list = getCategory(category) || [];
  const existing = !isNew && list[Number(index)] ? { ...EMPTY_ITEM, ...list[Number(index)] } : { ...EMPTY_ITEM, status: category };

  const { register, handleSubmit } = useForm({
    defaultValues: existing,
  });

  if (!isNew && list.length === 0) {
    return <p className="page__muted">Загрузка…</p>;
  }

  const onSubmit = (data) => {
    const item = { ...EMPTY_ITEM, ...data };
    if (isNew) {
      addItem(category, item);
    } else {
      updateItem(category, Number(index), item);
    }
    navigate(`/agents/${category}`);
  };

  const handleSaveToGitHub = async () => {
    const { owner, repo, token } = getStoredGitHub();
    if (!owner || !repo || !token) {
      alert('Заполните настройки GitHub (Обзор → Настройки GitHub).');
      return;
    }
    try {
      await saveFile({
        owner,
        repo,
        path: 'client/public/data/agents.json',
        content: JSON.stringify(raw, null, 2),
        message: `Update agent in ${category}`,
        token,
      });
      setSaved(true);
      alert('Сохранено в GitHub.');
    } catch (e) {
      alert('Ошибка: ' + e.message);
    }
  };

  const fields = [
    { name: 'status', label: 'Статус', type: 'text' },
    { name: 'announce', label: 'Титул (обращение)', type: 'text' },
    { name: 'title', label: 'Титул', type: 'text' },
    { name: 'name', label: 'Имя', type: 'text' },
    { name: 'surname', label: 'Фамилия', type: 'text' },
    { name: 'attitude', label: 'Отношение', type: 'text' },
    { name: 'appearance', label: 'Внешность', type: 'textarea' },
    { name: 'background', label: 'Предыстория', type: 'textarea' },
    { name: 'biases', label: 'Предубеждения', type: 'textarea' },
    { name: 'strengths', label: 'Сильные стороны', type: 'textarea' },
    { name: 'weakness', label: 'Слабости', type: 'textarea' },
    { name: 'skills', label: 'Навыки', type: 'text' },
    { name: 'death', label: 'Смерть', type: 'textarea' },
    { name: 'imgref', label: 'URL изображения', type: 'url' },
  ];

  const hasExtra = ['dpc', 'pc'].includes(category);

  return (
    <div className="page agent-edit">
      <h1 className="page__title">{isNew ? 'Новая запись' : 'Редактирование'}: {category}</h1>
      <form className="agent-edit__form" onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ name, label, type }) => (
          <div key={name} className="agent-edit__field">
            <label className="agent-edit__label" htmlFor={name}>{label}</label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                className="agent-edit__input"
                rows={4}
                {...register(name)}
              />
            ) : (
              <input
                id={name}
                type={type === 'url' ? 'url' : 'text'}
                className="agent-edit__input"
                {...register(name)}
              />
            )}
          </div>
        ))}
        {hasExtra && EXTRA_FIELDS.map((name) => (
          <div key={name} className="agent-edit__field">
            <label className="agent-edit__label" htmlFor={name}>{name}</label>
            <input id={name} type="text" className="agent-edit__input" {...register(name)} />
          </div>
        ))}
        <div className="agent-edit__actions">
          <button type="submit" className="agent-edit__btn agent-edit__btn_primary">
            {isNew ? 'Добавить' : 'Сохранить'}
          </button>
          <button type="button" className="agent-edit__btn" onClick={handleSaveToGitHub}>
            Сохранить в GitHub
          </button>
          <Link to={`/agents/${category}`} className="agent-edit__btn">Отмена</Link>
        </div>
      </form>
    </div>
  );
}
