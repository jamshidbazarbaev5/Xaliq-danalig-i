import { useNavigate } from 'react-router-dom';
import { useGetBooks, useDeleteBook, type Book } from '../core/api/books';
import { ResourceTable } from '@/core/helpers/ResourceTable';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';

type ApiResponse<T> = T[] | { results: T[]; count: number };

function getBooksArray<T>(data: ApiResponse<T> | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results;
}

export default function BooksPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: booksData, isLoading } = useGetBooks();
  const books = getBooksArray(booksData);
  const deleteBook = useDeleteBook();

  const columns = [
    {
      header: t('pages.books.fields.titleCyrillic'),
      accessorKey: 'title_cyr',
    },
    
    {
      header: t('pages.books.fields.descriptionCyrillic'),
      accessorKey: 'description_cyr',
    },
   
    {
      header: t('pages.books.fields.publisher'),
      accessorKey: 'publisher',
    },
    {
      header: t('pages.books.fields.categories'),
      accessorKey: 'categories',
      cell: (row: Book) => (
        <div className="flex flex-wrap gap-1">
          {row.categories.map((category) => (
            <span key={category.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {category.name_cyr}
            </span>
          ))}
        </div>
      )
    },
   
    {
      header: t('pages.books.fields.status'),
      accessorKey: 'is_active',
      cell: (row: Book) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? t('common.active') : t('common.inactive')}
        </span>
      )
    },
    {
      header: t('pages.books.fields.order'),
      accessorKey: 'order',
    },
   
  ];

  const handleEdit = (book: Book) => {
    navigate(`/books/edit/${book.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBook.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('pages.books.title')}</h1>
        <Button onClick={() => navigate('/books/create')}>
          {t('pages.books.addButton')}
        </Button>
      </div>

      <ResourceTable<Book>
        data={books}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
