import { useNavigate } from "react-router-dom";
import { useCreateBook } from "../core/api/books";
import { ResourceForm } from "../core/helpers/ResourceForm";
import { useGetCategories } from "../core/api/categories";
import { useGetAuthors } from "../core/api/authors";
import { useTranslation } from "react-i18next";

export default function CreateBookPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createBook = useCreateBook();
  const { data: categoriesData } = useGetCategories();
  const { data: authorsData } = useGetAuthors();
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.results || [];
  const authors = Array.isArray(authorsData)
    ? authorsData
    : authorsData?.results || [];

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
      name: "publisher",
      label: t("pages.books.fields.publisher"),
      type: "text" as const,
      required: true,
    },
    {
      name: "is_active",
      label: t("pages.books.fields.status"),
      type: "select" as const,
      options: [
        { value: true, label: t("common.active") },
        { value: false, label: t("common.inactive") },
      ],
      required: true,
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
      required: true,
      accept: "image/*",
    },
    {
      name: "epub_file_cyr",
      label: t("pages.books.fields.epubFileCyrillic"),
      type: "file" as const,
      required: true,
      accept: ".epub",
    },
    {
      name: "epub_file_lat",
      label: t("pages.books.fields.epubFileLatin"),
      type: "file" as const,
      required: true,
      accept: ".epub",
    },
    {
      name: "categories",
      label: t("pages.books.fields.categories"),
      type: "multiselect" as const,
      options: categories.map((cat) => ({
        value: cat.id as number,
        label: cat.name_cyr,
      })),
      required: true,
    },
    {
      name: "authors",
      label: t("pages.books.fields.authors"),
      type: "multiselect" as const,
      options: authors.map((author) => ({
        value: author.id as number,
        label: author.name_cyr,
      })),
      required: true,
    },
  ];

  const handleSubmit = async (data: Record<string, unknown>) => {
    const formData = new FormData();

    // Add all text and number fields to FormData
    Object.keys(data).forEach((key) => {
      if (
        data[key] &&
        !["cover_image", "epub_file_cyr", "epub_file_lat"].includes(key)
      ) {
        // Handle categories and authors arrays
        if (key === "categories" || key === "authors") {
          if (Array.isArray(data[key])) {
            data[key].forEach((item: number) => {
              formData.append(key, item.toString());
            });
          }
        } else if (typeof data[key] === "boolean" || key === "is_active") {
          formData.append(
            key,
            String(data[key] === true || data[key] === "true"),
          );
        } else {
          formData.append(key, String(data[key]));
        }
      }
    });

    // Add files
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
      await createBook.mutateAsync(formData);
      navigate("/books");
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("pages.books.createTitle")}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ResourceForm
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          isSubmitting={createBook.isPending}
        />
      </div>
    </div>
  );
}
