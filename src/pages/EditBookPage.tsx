import { useNavigate, useParams } from 'react-router-dom';
import { useGetBooks, useUpdateBook, type Book } from '../core/api/books';
import { ResourceForm } from '../core/helpers/ResourceForm';
import { useGetCategories } from '../core/api/categories';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Form-specific type that matches the form structure
interface FormBook extends Omit<Book, 'categories'> {
  categories: number[];
}
         
export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const updateBook = useUpdateBook();
  const { data: booksData } = useGetBooks();
  const { data: categoriesData } = useGetCategories();
  
  const books = Array.isArray(booksData) ? booksData : booksData?.results || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];
  const [book, setBook] = useState<FormBook | null>(null);

  useEffect(() => {
    const currentBook = books.find((b: Book) => b.id === Number(id));
    if (currentBook) {
      const bookForForm: FormBook = {
        ...currentBook,
        categories: currentBook.categories.map(cat => cat.id)
      };
      setBook(bookForForm);
    }
  }, [books, id]);

  const formFields = [
    {
      name: 'title_cyr',
      label: t('pages.books.fields.titleCyrillic'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'title_lat',
      label: t('pages.books.fields.titleLatin'),
      type: 'text' as const,
      required: true,
    },
    {
      name: 'description_cyr',
      label: t('pages.books.fields.descriptionCyrillic'),
      type: 'textarea' as const,
      required: true,
    },
    {
      name: 'description_lat',
      label: t('pages.books.fields.descriptionLatin'),
      type: 'textarea' as const,
      required: true,
    },
    {
      name: 'publication_year',
      label: t('pages.books.fields.publicationYear'),
      type: 'number' as const,
      required: true,
    },
    {
      name: 'is_active',
      label: t('pages.books.fields.status'),
      type: 'select' as const,
      options: [
        { value: true, label: t('common.active') },
        { value: false, label: t('common.inactive') }
      ],
      required: true,
    },
    {
      name: 'order',
      label: t('pages.books.fields.order'),
      type: 'number' as const,
      required: true,
    },
    {
      name: 'cover_image',
      label: t('pages.books.fields.coverImage'),
      type: 'file' as const,
      accept: 'image/*',
      existingImage: typeof book?.cover_image === 'string' ? book.cover_image : undefined,
    },
    {
      name: 'epub_file_cyr',
      label: t('pages.books.fields.epubFileCyrillic'),
      type: 'file' as const,
      accept: '.epub',
      existingFile: typeof book?.epub_file_cyr === 'string' ? book.epub_file_cyr : undefined,
      existingFileName: 'Current Cyrillic EPUB',
    },
    {
      name: 'epub_file_lat',
      label: t('pages.books.fields.epubFileLatin'),
      type: 'file' as const,
      accept: '.epub',
      existingFile: typeof book?.epub_file_lat === 'string' ? book.epub_file_lat : undefined,
      existingFileName: 'Current Latin EPUB',
    },
    {
      name: 'categories',
      label: t('pages.books.fields.categories'),
      type: 'select' as const,
      options: categories.map(cat => ({
        value: cat.id as number,
        label: cat.name_cyr,
      })),
      required: true,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    if (!id) return;
    
    const formData = new FormData();
    
    // Add all text and number fields to FormData
    Object.keys(data).forEach(key => {
      if (data[key] && !['cover_image', 'epub_file_cyr', 'epub_file_lat'].includes(key)) {
        // Convert boolean and arrays to strings
        if (typeof data[key] === 'boolean' || Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Add files only if new ones are selected
    if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image);
    }
    if (data.epub_file_cyr instanceof File) {
      formData.append('epub_file_cyr', data.epub_file_cyr);
    }
    if (data.epub_file_lat instanceof File) {
      formData.append('epub_file_lat', data.epub_file_lat);
    }

    try {
      await updateBook.mutateAsync({ 
        id: Number(id), 
        formData
      });
      navigate('/books');
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  if (!book) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('pages.books.editTitle')}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          defaultValues={book}
          isSubmitting={updateBook.isPending}
        />
      </div>
    </div>
  );
}
