import { useNavigate } from 'react-router-dom';
import { useGetAuthors, useDeleteAuthor, type Author } from '../core/api/authors';
import { ResourceTable } from '@/core/helpers/ResourceTable';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';

type ApiResponse<T> = T[] | { results: T[]; count: number };

function getAuthorsArray(data: ApiResponse<Author> | undefined): Author[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results;
}

export default function AuthorsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: authorsData, isLoading } = useGetAuthors();
  const authors = getAuthorsArray(authorsData);
  const deleteAuthor = useDeleteAuthor();
  const formatToTruncate = (text: string, length: number = 50): string => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const columns = [
    {
      header: t('pages.authors.fields.nameCyrillic'),
      accessorKey: 'name_cyr',
    },
    
    {
      header: t('pages.authors.fields.biographyCyrillic'),

      accessorKey: (row: Author) => formatToTruncate(row.biography_cyr, 20),
    },
    
    {
      header: t('pages.authors.fields.dateOfBirth'),
      accessorKey: 'date_of_birth',
    },
    {
      header: t('pages.authors.fields.dateOfDeath'),
      accessorKey: 'date_of_death',
    },
  ];

  const handleEdit = (author: Author) => {
    navigate(`/authors/edit/${author.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAuthor.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete author:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('pages.authors.title')}</h1>
        <Button onClick={() => navigate('/authors/create')}>
          {t('pages.authors.addButton')}
        </Button>
      </div>

      <ResourceTable<Author>
        data={authors}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
