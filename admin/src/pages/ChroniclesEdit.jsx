import SimpleCollectionEditor from '../components/SimpleCollectionEditor';

export default function ChroniclesEdit() {
  return (
    <SimpleCollectionEditor
      title="Хроники кампании"
      description="Добавление глав хроники: заголовок, порядок, дата, место и текст события."
      collectionKey="chronicles"
      emptyItem={{
        title: '',
        chapter: '',
        order: '',
        date: '',
        location: '',
        summary: '',
        description: '',
      }}
      fields={[
        { name: 'title', label: 'Заголовок', type: 'text', required: true },
        { name: 'chapter', label: 'Глава', type: 'text' },
        { name: 'order', label: 'Порядок (число)', type: 'number' },
        { name: 'date', label: 'Дата/эпизод', type: 'text' },
        { name: 'location', label: 'Локация', type: 'text' },
        { name: 'summary', label: 'Краткое резюме', type: 'textarea', rows: 2 },
        { name: 'description', label: 'Полное описание', type: 'textarea', rows: 5 },
      ]}
    />
  );
}
