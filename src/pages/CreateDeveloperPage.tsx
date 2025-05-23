import { useNavigate } from 'react-router-dom';
import { useCreateDeveloper, } from '../core/api/developers';
import { ResourceForm } from '../core/helpers/ResourceForm';
import { useTranslation } from 'react-i18next';

export default function CreateDeveloperPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createDeveloper = useCreateDeveloper();

  const formFields = [
    {
      name: 'name',
      label: t('pages.developers.fields.name'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'description',
      label: t('pages.developers.fields.description'),
      type: 'textarea' as const,
      required: true,
    },
    {
      name: 'photo',
      label: t('pages.developers.fields.photo'),
      type: 'file' as const,
      accept: 'image/*',
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();
    
    // Add all text fields to FormData
    Object.keys(data).forEach(key => {
      if (data[key] && key !== 'photo') {
        formData.append(key, data[key]);
      }
    });

    // Add photo if it exists
    if (data.photo instanceof File) {
      formData.append('photo', data.photo);
    }

    try {
      await createDeveloper.mutateAsync(formData);
      navigate('/developers');
    } catch (error) {
      console.error('Failed to create developer:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('pages.developers.createTitle')}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          isSubmitting={createDeveloper.isPending}
        />
      </div>
    </div>
  );
}
