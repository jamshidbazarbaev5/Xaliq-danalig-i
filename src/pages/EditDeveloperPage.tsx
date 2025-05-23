import { useNavigate, useParams } from 'react-router-dom';
import { useGetDevelopers, useUpdateDeveloper, type Developer } from '../core/api/developers';
import { ResourceForm } from '../core/helpers/ResourceForm';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function EditDeveloperPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const updateDeveloper = useUpdateDeveloper();
  const { data: developersData } = useGetDevelopers();
  const developers = Array.isArray(developersData) ? developersData : developersData?.results || [];
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const currentDeveloper = developers.find((dev: Developer) => dev.id === Number(id));
    if (currentDeveloper) {
      setDeveloper(currentDeveloper);
      if (typeof currentDeveloper.photo === 'string') {
        setPhotoPreview(currentDeveloper.photo);
      }
    }
  }, [developers, id]);

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
      preview: photoPreview,
      onFileChange: (file: File) => {
        const url = URL.createObjectURL(file);
        setPhotoPreview(url);
        return () => URL.revokeObjectURL(url);
      }
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    if (!id) return;

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
      await updateDeveloper.mutateAsync({ 
        id: Number(id), 
        formData
      });
      navigate('/developers');
    } catch (error) {
      console.error('Failed to update developer:', error);
    }
  };

  if (!developer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('pages.developers.editTitle')}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={{
            ...developer,
            photo: undefined // Clear the photo field since we're using preview
          }}
          isSubmitting={updateDeveloper.isPending}
        />
      </div>
    </div>
  );
}
