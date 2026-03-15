import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

export default function PlayersEdit() {
  return (
    <SimpleCollectionEditor
      title="Персонажи игроков"
      description="Карточки персонажей игроков: имя, портрет, описание, уровень, статус и PDF чарника."
      collectionKey="players"
      emptyItem={{
        name: '',
        image: '',
        about: '',
        level: '',
        status: '',
        pdf: '',
      }}
      fields={[
        { name: 'name', label: 'Имя', type: 'text', required: true },
        { name: 'image', label: 'Ссылка на изображение', type: 'url' },
        { name: 'about', label: 'О нем', type: 'textarea', rows: 4, required: true },
        { name: 'level', label: 'Уровень', type: 'text', required: true },
        { name: 'status', label: 'Статус (alive/dead/prison)', type: 'text', required: true },
        { name: 'pdf', label: 'PDF чарника', type: 'file', accept: '.pdf,application/pdf' },
      ]}
    />
  );
}
