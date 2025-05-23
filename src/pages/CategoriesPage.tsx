import { useNavigate } from 'react-router-dom';
import { useGetCategories, useDeleteCategory, type Category } from '../core/api/categories';
import { ResourceTable } from '@/core/helpers/ResourceTable';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';

type ApiResponse<T> = T[] | { results: T[]; count: number };

function getCategoriesArray<T>(data: ApiResponse<T> | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results;
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading } = useGetCategories();
  const categories = getCategoriesArray(categoriesData);
  const deleteCategory = useDeleteCategory();
  const { t } = useTranslation();

  const columns = [
    {
      header: t('pages.categories.fields.nameCyrillic'),
      accessorKey: 'name_cyr',
    },
    {
      header: t('pages.categories.fields.nameLatin'),
      accessorKey: 'name_lat',
    },
    {
      header: t('pages.categories.fields.descriptionCyrillic'),
      accessorKey: 'description_cyr',
    },
    {
      header: t('pages.categories.fields.descriptionLatin'),
      accessorKey: 'description_lat',
    },
  ];

  const handleEdit = (category: Category) => {
    navigate(`/categories/edit/${category.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('pages.categories.title')}</h1>
        <Button onClick={() => navigate('/categories/create')}>
          {t('pages.categories.addButton')}
        </Button>
      </div>

      <ResourceTable<Category>
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
