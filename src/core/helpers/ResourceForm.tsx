import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PlusCircle } from 'lucide-react';
import { t } from 'i18next';

// Update the FormField interface to be more specific about the field types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'searchable-select' | 'file' | 'multiple-files';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  required?: boolean;
  readOnly?: boolean;
  imageUrl?: string;
  preview?: string;
  existingImage?: string;
  existingFile?: string;  // For non-image files like epub
  existingFileName?: string;  // To display the filename of existing file
  onDeleteImage?: (imageId?: number) => void;
  existingImages?: Array<{ id?: number; url: string }>;
  // For searchable-select
  searchTerm?: string;
  onSearch?: (value: string) => void;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  defaultValue?: any;
  onChange?: (value: any) => void;
  accept?: string;  // For specifying accepted file types
}

// Update the ResourceFormProps interface to be more specific about generic type T
interface ResourceFormProps<T extends Record<string, any>> {
  fields: any[]; // Revert back to using FormField[]
  onSubmit: (data: T) => void;
  defaultValues?: Partial<T>;
  isSubmitting?: boolean;
  title: string;
  hideSubmitButton?: boolean;
  children?: React.ReactNode;
  form?: ReturnType<typeof useForm<T>>;
}

export function ResourceForm<T extends Record<string, any>>({
  fields,
  onSubmit,
  defaultValues = {},
  isSubmitting = false,
  title,
  hideSubmitButton = false,
  children,
  form: providedForm,
}: ResourceFormProps<T>) {
  const transformedDefaultValues = fields.reduce((acc, field) => {
    if (field.name.includes('.')) {
      const [parent, child] = field.name.split('.');
      if (!acc[parent]) {
        acc[parent] = {};
      }
      acc[parent][child] = defaultValues[parent]?.[child] || '';
    } else {
      acc[field.name] = defaultValues[field.name] || '';
    }
    return acc;
  }, {} as Record<string, any>);

  const form = providedForm || useForm<T>({
    defaultValues: transformedDefaultValues,
  });

  const handleSubmit = (data: any) => {
    const transformedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null && !(value instanceof File)) {
        acc[key] = value;
      } else {
        const keys = key.split('.');
        if (keys.length > 1) {
          const [parent, child] = keys;
          if (!acc[parent]) {
            acc[parent] = {};
          }
          acc[parent][child] = value;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    onSubmit(transformedData as T);
  };

  const { setValue } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{title}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea
                          placeholder={field.placeholder}
                          {...formField}
                          readOnly={field.readOnly}
                          className={field.readOnly ? 'bg-gray-100' : ''}
                        />
                      ) : field.type === 'select' ? (
                        <Select
                          onValueChange={(value) => {
                            formField.onChange(value);
                            // Call the custom onChange handler if provided
                            if (field.onChange) {
                              field.onChange(value);
                            }
                          }}
                          value={formField.value?.toString()}
                          defaultValue={field.defaultValue?.toString()}
                        >
                          <SelectTrigger className={field.readOnly ? 'bg-gray-100' : ''}>
                            <SelectValue placeholder={field.placeholder || t('placeholders.select')} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option: { value: string | number; label: string }) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'searchable-select' ? (
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value?.toString()}
                          defaultValue={formField.value?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent onPointerDownOutside={(e) => {
                            const target = e.target as Node;
                            const selectContent = document.querySelector('.select-content-wrapper');
                            if (selectContent && selectContent.contains(target)) {
                              e.preventDefault();
                            }
                          }}>
                            <div className="p-2 sticky top-0 bg-white z-10 border-b select-content-wrapper">
                              <Input
                                type="text"
                                placeholder={`Search ${field.label.toLowerCase()}...`}
                                value={field.searchTerm || ''}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  field.onSearch && field.onSearch(e.target.value);
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="flex-1"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                              {field.options && field.options.length > 0 ? (
                                field.options.map((option: { value: string | number; label: string }) => (
                                  <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-center text-gray-500 text-sm">
                                  No results found
                                </div>
                              )}
                            </div>
                            {field.showCreateButton && (
                              <div className="p-2 border-t sticky bottom-0 bg-white z-10">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onCreateClick && field.onCreateClick();
                                  }}
                                  className="w-full flex items-center justify-center gap-2"
                                >
                                  <PlusCircle size={16} />
                                  Create New {field.label}
                                </Button>
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'file' ? (
                        <div className="space-y-2">
                          {field.existingImage && (
                            <div className="mb-2">
                              <img 
                                src={field.existingImage} 
                                alt={field.label} 
                                className="h-20 w-20 object-cover rounded-md"
                              />
                            </div>
                          )}
                          {field.existingFile && (
                            <div className="mb-2 flex items-center gap-2">
                              <a 
                                href={field.existingFile} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {field.existingFileName || 'View current file'}
                              </a>
                            </div>
                          )}
                          <Input
                            type="file"
                            onChange={(e:any) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setValue(field.name, file);
                              }
                            }}
                            required={field.required && !field.existingImage && !field.existingFile}
                            accept={field.accept || "image/*"}
                          />
                        </div>
                      ) : field.type === 'multiple-files' ? (
                        <div className="space-y-2">
                          {/* Show existing images */}
                          {field.existingImages && field.existingImages.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-4">
                              {field.existingImages.map((img:any, idx:any) => (
                                <div key={img.id || idx} className="relative">
                                  <img 
                                    src={img.url} 
                                    alt={`Image ${idx + 1}`} 
                                    className="h-20 w-20 object-cover rounded-md"
                                  />
                                  {field.onDeleteImage && (
                                    <button
                                      type="button"
                                      onClick={() => field.onDeleteImage(img.id)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                                      aria-label="Delete image"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Multiple file input */}
                          <Input
                            type="file"
                            onChange={(e:any) => {
                              const files = Array.from(e.target.files || []);
                              const currentValues = form.getValues(field.name) || [];
                              form.setValue(field.name, [...currentValues, ...files] as any);
                            }}
                            multiple
                            accept="image/*"
                          />
                        </div>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...formField}
                          readOnly={field.readOnly}
                          className={field.readOnly ? 'bg-gray-100' : ''}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          
          {children}
          
          <div className="col-span-full mt-6">
            {!hideSubmitButton && (
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? t("common.sending") : t("common.submit")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}