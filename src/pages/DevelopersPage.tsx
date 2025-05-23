import { useNavigate } from 'react-router-dom';
import { useGetDevelopers, useDeleteDeveloper, type Developer } from '../core/api/developers';
import { ResourceTable } from '@/core/helpers/ResourceTable';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';

type ApiResponse<T> = T[] | { results: T[]; count: number };

function getDevelopersArray<T>(data: ApiResponse<T> | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results;
}

export default function DevelopersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: developersData, isLoading } = useGetDevelopers();
  const developers = getDevelopersArray(developersData);
  const deleteDeveloper = useDeleteDeveloper();

  const columns = [
    {
      header: t('pages.developers.fields.name'),
      accessorKey: 'name',
    },
    {
      header: t('pages.developers.fields.description'),
      accessorKey: 'description',
    },
    {
      header: t('pages.developers.fields.photo'),
      accessorKey: 'photo',
      cell: (row: Developer) => {
        const photoUrl = typeof row.photo === 'string' ? row.photo : null;
        return photoUrl ? (
          <img src={photoUrl} 
               alt={row.name} 
               className="h-10 w-10 object-cover rounded-full"
          />
        ) : null;
      }
    }
  ];

  const handleEdit = (developer: Developer) => {
    navigate(`/developers/edit/${developer.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDeveloper.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete developer:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('pages.developers.title')}</h1>
        <Button onClick={() => navigate('/developers/create')}>
          {t('pages.developers.addButton')}
        </Button>
      </div>

      <ResourceTable<Developer>
        data={developers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
