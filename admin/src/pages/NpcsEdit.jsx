import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

export default function NpcsEdit() {
  return (
    <SimpleCollectionEditor
      title="НПС"
      description="Создание и редактирование НПС: статус, роль, описание и изображение."
      collectionKey="npcs"
      emptyItem={{
        name: '',
        role: '',
        status: '',
        attitude: '',
        shortDescription: '',
        description: '',
        details: '',
        image: '',
      }}
      fields={[
        { name: 'name', label: 'Имя', type: 'text', required: true },
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
