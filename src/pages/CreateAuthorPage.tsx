import { useNavigate } from 'react-router-dom';
import { useCreateAuthor, } from '../core/api/authors';
import { ResourceForm } from '../core/helpers/ResourceForm';
import { useTranslation } from 'react-i18next';

export default function CreateAuthorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createAuthor = useCreateAuthor();

  const formFields = [
    {
      name: 'name_cyr',
      label: t('pages.authors.fields.nameCyrillic'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'name_lat',
      label: t('pages.authors.fields.nameLatin'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'biography_cyr',
      label: t('pages.authors.fields.biographyCyrillic'),
      type: 'textarea' as const,
      required: true,
    },
    {
      name: 'biography_lat',
      label: t('pages.authors.fields.biographyLatin'),
      type: 'textarea' as const,
      required: true,
    },
    {
      name: 'date_of_birth',
      label: t('pages.authors.fields.dateOfBirth'),
      type: 'date' as const,
      required: true,
    },
    {
      name: 'date_of_death',
      label: t('pages.authors.fields.dateOfDeath'),
      type: 'date' as const,
    },
    {
      name: 'photo',
      label: t('pages.authors.fields.photo'),
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
      await createAuthor.mutateAsync(formData);
      navigate('/authors');
    } catch (error) {
      console.error('Failed to create author:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('pages.authors.createTitle')}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          isSubmitting={createAuthor.isPending}
        />
      </div>
    </div>
  );
}
