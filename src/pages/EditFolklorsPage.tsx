import { useNavigate, useParams } from "react-router-dom";
import {
  useGetFolklors,
  useUpdateFolklor,
  type Book,
} from "../core/api/folklore";
import { ResourceForm } from "../core/helpers/ResourceForm";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { set } from 'react-hook-form';

// Form-specific type that matches the form structure
interface FormBook extends Omit<Book, "categories" | "authors"> {
  categories: number[];
  authors: number[];
}

export default function EditFolklorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const updateBook = useUpdateFolklor();
  const { data: booksData } = useGetFolklors();
  const [is_active, setis_active] = useState(false);
  const books = Array.isArray(booksData) ? booksData : booksData?.results || [];
  
  
  const [book, setBook] = useState<FormBook | null>(null);

  useEffect(() => {
    const currentBook = books.find((b: Book) => b.id === Number(id));
    if (currentBook) {
      const bookForForm: FormBook = {
        ...currentBook,
        categories: currentBook.categories?.map((cat) => cat.id) || [],
        authors: currentBook.authors?.map((author) => author.id) || [],
      };
      setBook(bookForForm);
      setis_active(Boolean(currentBook.is_active));
    }
  }, [books, id]);

  const formFields = [
    {
      name: "title_cyr",
      label: t("pages.books.fields.titleCyrillic"),
      type: "text" as const,
      required: true,
    },
    {
      name: "title_lat",
      label: t("pages.books.fields.titleLatin"),
      type: "text" as const,
      required: true,
    },
    {
      name: "description_cyr",
      label: t("pages.books.fields.descriptionCyrillic"),
      type: "textarea" as const,
      required: true,
    },
    {
      name: "description_lat",
      label: t("pages.books.fields.descriptionLatin"),
      type: "textarea" as const,
      required: true,
    },
    {
      name: "publication_year",
      label: t("pages.books.fields.publicationYear"),
      type: "number" as const,
      required: true,
    },
    {
      name: "is_active",
      label: t("pages.books.fields.status"),
      type: "select" as const,
      options: [
        { value: "true", label: t("common.active") },
        { value: "false", label: t("common.inactive") },
      ],
      required: true,
      defaultValue: is_active ? "true" : "false",
    },
    {
      name: "order",
      label: t("pages.books.fields.order"),
      type: "number" as const,
      required: true,
    },
    {
      name: "cover_image",
      label: t("pages.books.fields.coverImage"),
      type: "file" as const,
      accept: "image/*",
      existingImage:
        typeof book?.cover_image === "string" ? book.cover_image : undefined,
    },
    {
      name: "epub_file_cyr",
      label: t("pages.books.fields.epubFileCyrillic"),
      type: "file" as const,
      accept: ".epub",
      existingFile:
        typeof book?.epub_file_cyr === "string"
          ? book.epub_file_cyr
          : undefined,
      existingFileName: "Current Cyrillic EPUB",
    },
    {
      name: "epub_file_lat",
      label: t("pages.books.fields.epubFileLatin"),
      type: "file" as const,
      accept: ".epub",
      existingFile:
        typeof book?.epub_file_lat === "string"
          ? book.epub_file_lat
          : undefined,
      existingFileName: "Current Latin EPUB",
    },
   
    
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    if (!id) return;

    const formData = new FormData();

    // Add all text and number fields to FormData
    Object.keys(data).forEach((key) => {
      if (
        data[key] &&
        !["cover_image", "epub_file_cyr", "epub_file_lat"].includes(key)
      ) {
        if (key === "categories" || key === "authors") {
          // Handle categories and authors arrays
          if (Array.isArray(data[key])) {
            (data[key] as number[]).forEach((item: number) => {
              formData.append(key, item.toString());
            });
          }
        } else if (key === "is_active") {
          // Convert string 'true'/'false' to boolean string
          formData.append(key, String(data[key] === "true"));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Add files only if new ones are selected
    if (data.cover_image instanceof File) {
      formData.append("cover_image", data.cover_image);
    }
    if (data.epub_file_cyr instanceof File) {
      formData.append("epub_file_cyr", data.epub_file_cyr);
    }
    if (data.epub_file_lat instanceof File) {
      formData.append("epub_file_lat", data.epub_file_lat);
    }

    try {
      await updateBook.mutateAsync({
        id: Number(id),
        formData,
      });
      navigate("/folklors");
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  if (!book) {
    return <div>{t("common.loading")}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("pages.books.editTitle")}</h1>
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
