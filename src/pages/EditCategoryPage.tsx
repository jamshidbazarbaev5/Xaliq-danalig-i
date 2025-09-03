import { useNavigate, useParams } from 'react-router-dom';
import { useGetCategory, useGetCategories, useUpdateCategory, type Category } from '../core/api/categories';
import { ResourceForm } from '../core/helpers/ResourceForm';

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateCategory = useUpdateCategory();
  const { data: category, isLoading } = useGetCategory(Number(id)); // Add this line
  const { data: categoriesData } = useGetCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];

  const formFields = [
    {
      name: 'name_cyr',
      label: 'Name (Cyrillic)',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'name_lat',
      label: 'Name (Latin)',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'description_cyr',
      label: 'Description (Cyrillic)',
      type: 'textarea' as const,
    },
    {
      name: 'description_lat',
      label: 'Description (Latin)',
      type: 'textarea' as const,
    },
    {
      name: 'parent',
      label: 'Parent Category',
      type: 'select' as const,
      options: categories
        .filter((cat: Category) => cat.id !== Number(id))
        .map((cat: Category) => ({
          value: cat.id as number,
          label: cat.name_cyr,
        })) || [],
      optional: true,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    if (!id) return;
    
    try {
      await updateCategory.mutateAsync({ 
        id: Number(id), 
        ...data as Category 
      });
      navigate('/categories');
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  if (isLoading || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={category}
          isSubmitting={updateCategory.isPending}
        />
      </div>
    </div>
  );
}
