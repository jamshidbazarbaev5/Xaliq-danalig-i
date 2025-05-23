import { useNavigate } from 'react-router-dom';
import { useCreateCategory, type Category } from '../core/api/categories';
import { ResourceForm } from '../core/helpers/ResourceForm';
import { useGetCategories } from '../core/api/categories';
import { useTranslation } from 'react-i18next';

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const { data: categoriesData } = useGetCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];
  const { t } = useTranslation();

  const formFields = [
    {
      name: 'name_cyr',
      label: t('pages.categories.fields.nameCyrillic'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'name_lat',
      label: t('pages.categories.fields.nameLatin'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'description_cyr',
      label: t('pages.categories.fields.descriptionCyrillic'),
      type: 'textarea' as const,
    },
    {
      name: 'description_lat',
      label: t('pages.categories.fields.descriptionLatin'),
      type: 'textarea' as const,
    },
    {
      name: 'parent',
      label: t('pages.categories.fields.parentCategory'),
      type: 'select' as const,
      options: categories?.map((cat: Category) => ({
        value: cat.id as number,
        label: cat.name_cyr,
      })) || [],
      optional: true,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await createCategory.mutateAsync(data as Category);
      navigate('/categories');
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('pages.categories.createTitle')}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          isSubmitting={createCategory.isPending}
        />
      </div>
    </div>
  );
}
