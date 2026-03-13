import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

export default function ArtifactsEdit() {
  return (
    <SimpleCollectionEditor
      title="Артефакты"
      description="Добавление артефактов: название, тип, редкость, описание и свойства."
      collectionKey="artifacts"
      emptyItem={{
        name: '',
        type: '',
        rarity: '',
        role: '',
        status: '',
        shortDescription: '',
        description: '',
        effects: '',
        details: '',
        image: '',
      }}
      fields={[
        { name: 'name', label: 'Название', type: 'text' },
        { name: 'type', label: 'Тип', type: 'text' },
        { name: 'rarity', label: 'Редкость', type: 'text' },
        { name: 'role', label: 'Роль', type: 'text' },
        { name: 'status', label: 'Статус', type: 'text' },
        { name: 'shortDescription', label: 'Краткое описание (для карточки)', type: 'textarea', rows: 2 },
        { name: 'description', label: 'Описание (для модалки)', type: 'textarea', rows: 4 },
        { name: 'effects', label: 'Эффекты', type: 'textarea', rows: 3 },
        { name: 'details', label: 'Доп. детали', type: 'textarea', rows: 3 },
        { name: 'image', label: 'Ссылка на изображение', type: 'url' },
      ]}
    />
  );
}
