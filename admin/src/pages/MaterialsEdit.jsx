import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

export default function MaterialsEdit() {
  return (
    <SimpleCollectionEditor
      title="Материалы"
      description="Ссылки, описания и названия материалов для игроков и мастера."
      collectionKey="materials"
      emptyItem={{
        title: '',
        shortDescription: '',
        description: '',
        details: '',
        image: '',
        url: '',
      }}
      fields={[
        { name: 'title', label: 'Название', type: 'text' },
        { name: 'shortDescription', label: 'Краткое описание (для карточки)', type: 'textarea', rows: 2 },
        { name: 'description', label: 'Описание (для модалки)', type: 'textarea', rows: 3 },
        { name: 'details', label: 'Доп. детали', type: 'textarea', rows: 3 },
        { name: 'image', label: 'Ссылка на изображение', type: 'url' },
        { name: 'url', label: 'Ссылка', type: 'url' },
      ]}
    />
  );
}
