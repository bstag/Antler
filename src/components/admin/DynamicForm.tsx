import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldDefinition, SchemaDefinition } from '../../lib/admin/types';

interface DynamicFormProps {
  schema: SchemaDefinition;
  defaultValues?: Record<string, any>;
  data?: Record<string, any>;
  onChange?: (data: Record<string, any>) => void;
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  registerSubmitRef?: (submitFn: () => void) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  defaultValues = {},
  data,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save',
  registerSubmitRef
}) => {
  
  // Create Zod schema from field definitions
  const createZodSchema = (fields: FieldDefinition[]) => {
    const schemaObject: Record<string, any> = {};

    fields.forEach(field => {
      let fieldSchema: any;

      switch (field.type) {
        case 'string':
          fieldSchema = z.string();
          if (field.enumValues) {
            fieldSchema = z.enum(field.enumValues as [string, ...string[]]);
          }
          break;
        case 'number':
          fieldSchema = z.number();
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min);
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.validation.max);
          }
          break;
        case 'boolean':
          fieldSchema = z.boolean();
          break;
        case 'date':
          fieldSchema = z.date();
          break;
        case 'array':
          if (field.arrayType === 'string') {
            fieldSchema = z.array(z.string());
          } else if (field.arrayType === 'number') {
            fieldSchema = z.array(z.number());
          } else {
            fieldSchema = z.array(z.string());
          }
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.optional) {
        fieldSchema = fieldSchema.optional();
      }

      if (field.defaultValue !== undefined) {
        fieldSchema = fieldSchema.default(field.defaultValue);
      }

      schemaObject[field.name] = fieldSchema;
    });

    return z.object(schemaObject);
  };

  const zodSchema = createZodSchema(schema.fields);

  // Preprocess the data to handle date fields and other conversions
  const processedDefaultValues = useMemo(() => {
    // Start with defaultValues, then override with data prop
    const processed = { ...defaultValues, ...data };

    schema.fields.forEach(field => {
      const value = processed[field.name];

      // Convert date strings to Date objects for the form
      if (field.type === 'date' && value) {
        if (typeof value === 'string') {
          processed[field.name] = new Date(value);
        } else if (value instanceof Date) {
          processed[field.name] = value;
        }
      }

      // Handle default values
      if (value === undefined && field.defaultValue !== undefined) {
        processed[field.name] = field.defaultValue;
      }
    });

    return processed;
  }, [defaultValues, data, schema.fields]);

  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: processedDefaultValues
  });

  // Register the submit function with the parent component
  useEffect(() => {
    if (registerSubmitRef) {
      registerSubmitRef(() => handleSubmit(handleFormSubmit)());
    }
  }, [handleSubmit, registerSubmitRef]);

  const renderField = (field: FieldDefinition) => {
    const error = errors[field.name];
    const fieldId = `field-${field.name}`;

    const baseClasses = `mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
      error ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
    }`;

    
    switch (field.type) {
      case 'string':
        if (field.enumValues) {
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <select
                  {...formField}
                  id={fieldId}
                  className={baseClasses}
                >
                  <option value="">Select {field.name}</option>
                  {field.enumValues!.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            />
          );
        }
        
        if (field.name.toLowerCase().includes('image') || field.name.toLowerCase().includes('photo')) {
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <div className="space-y-2">
                  <input
                    {...formField}
                    type="text"
                    id={fieldId}
                    placeholder="Enter image URL or upload below"
                    className={baseClasses}
                  />
                  <FileUploadButton
                    onUpload={(url) => setValue(field.name, url)}
                    accept="image/*"
                  />
                  {formField.value && (
                    <div className="mt-2">
                      <img
                        src={formField.value}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              )}
            />
          );
        }

        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <input
                {...formField}
                type="text"
                id={fieldId}
                className={baseClasses}
                placeholder={`Enter ${field.name}`}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <input
                {...formField}
                type="number"
                id={fieldId}
                className={baseClasses}
                placeholder={`Enter ${field.name}`}
                min={field.validation?.min}
                max={field.validation?.max}
                onChange={(e) => formField.onChange(e.target.value ? Number(e.target.value) : '')}
              />
            )}
          />
        );

      case 'boolean':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div className="flex items-center">
                <input
                  {...formField}
                  type="checkbox"
                  id={fieldId}
                  checked={formField.value || false}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={fieldId} className="ml-2 block text-sm text-gray-900 dark:text-white">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </label>
              </div>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <input
                {...formField}
                type="date"
                id={fieldId}
                className={baseClasses}
                value={formField.value ? new Date(formField.value).toISOString().split('T')[0] : ''}
                onChange={(e) => formField.onChange(e.target.value ? new Date(e.target.value) : '')}
              />
            )}
          />
        );

      case 'array':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <TagInput
                value={formField.value || []}
                onChange={formField.onChange}
                placeholder={`Add ${field.name}`}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <input
                {...formField}
                type="text"
                id={fieldId}
                className={baseClasses}
                placeholder={`Enter ${field.name}`}
              />
            )}
          />
        );
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={onSubmit ? handleSubmit(handleFormSubmit) : undefined} className="space-y-6">
      {schema.fields.map(field => (
        <div key={field.name}>
          <label
            htmlFor={`field-${field.name}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {renderField(field)}
          
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

// Tag Input Component
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = React.useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 min-h-[42px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white dark:bg-gray-800">
      <div className="flex flex-wrap gap-1">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-none outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>
  );
};

// File Upload Button Component
interface FileUploadButtonProps {
  onUpload: (url: string) => void;
  accept?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onUpload, accept = "*/*" }) => {
  const [uploading, setUploading] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'images');

      const response = await fetch('/admin/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onUpload(result.data.url);
        } else {
          alert('Upload failed: ' + result.error);
        }
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {uploading ? 'Uploading...' : 'Upload File'}
      </label>
    </div>
  );
};