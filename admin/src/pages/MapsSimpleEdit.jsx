import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

export default function MapsSimpleEdit() {
  return (
    <SimpleCollectionEditor
      title="Карты"
      description="Добавление карт: изображение и описание."
      collectionKey="maps"
      emptyItem={{
        title: '',
        imgref: '',
        shortDescription: '',
        description: '',
        location: '',
        notes: '',
      }}
      fields={[
        { name: 'title', label: 'Название карты', type: 'text' },
        { name: 'imgref', label: 'Ссылка на изображение', type: 'url' },
        { name: 'shortDescription', label: 'Краткое описание (для карточки)', type: 'textarea', rows: 2 },
        { name: 'description', label: 'Описание (для модалки)', type: 'textarea', rows: 3 },
        { name: 'location', label: 'Локация', type: 'text' },
        { name: 'notes', label: 'Примечания', type: 'textarea', rows: 2 },
      ]}
    />
  );
}
