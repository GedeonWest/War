import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

const AGENT_CATEGORY_OPTIONS = [
  { value: 'active', label: 'Активные' },
  { value: 'agent', label: 'Агенты' },
  { value: 'crown', label: 'Корона' },
  { value: 'secrown', label: 'Претенденты на корону' },
  { value: 'inactive', label: 'Неактивные' },
  { value: 'prison', label: 'В заключении' },
];

export default function NpcsEdit() {
  return (
    <SimpleCollectionEditor
      title="НПС"
      description="Создание и редактирование НПС: статус, роль, описание и изображение. Категория и чекбоксы влияют на фильтры на клиенте."
      collectionKey="npcs"
      emptyItem={{
        name: '',
        role: '',
        status: '',
        attitude: '',
        category: '',
        isActive: true,
        inPrison: false,
        shortDescription: '',
        description: '',
        details: '',
        image: '',
      }}
      fields={[
        { name: 'name', label: 'Имя', type: 'text', required: true },
        { name: 'category', label: 'Категория агента', type: 'select', options: AGENT_CATEGORY_OPTIONS },
        { name: 'isActive', label: 'Активен', type: 'checkbox', checkboxLabel: 'Агент активен' },
        { name: 'inPrison', label: 'В заключении', type: 'checkbox', checkboxLabel: 'В заключении' },
        { name: 'role', label: 'Роль', type: 'text' },
        { name: 'status', label: 'Статус', type: 'text' },
        { name: 'attitude', label: 'Отношение', type: 'text' },
        { name: 'shortDescription', label: 'Краткое описание (для карточки)', type: 'textarea', rows: 2 },
        { name: 'description', label: 'Описание (для модалки)', type: 'textarea', rows: 4 },
        { name: 'details', label: 'Доп. детали', type: 'textarea', rows: 3 },
        { name: 'image', label: 'Ссылка на изображение', type: 'url' },
      ]}
    />
  );
}
