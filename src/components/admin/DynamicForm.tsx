import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import type { Control, UseFormGetValues, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldDefinition, SchemaDefinition } from '../../lib/admin/types';
import { adminFetch } from '../../lib/admin/api-client';
import { logger } from '../../lib/utils/logger';

// Tag Input Component
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  id?: string;
}

const TagInput: React.FC<TagInputProps> = React.memo(({ value, onChange, placeholder, id }) => {
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
    <div className="tag-input-wrapper">
      <div className="flex flex-wrap gap-1">
        {value.map(tag => (
          <span
            key={tag}
            className="tag-input-tag"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="tag-input-remove"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
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
});

TagInput.displayName = 'TagInput';

// NestedObjectField Component
interface NestedObjectFieldProps {
  field: FieldDefinition;
  parentPath: string;
  control: Control<any>;
  getValues: UseFormGetValues<any>;
}

const NestedObjectField = React.memo<NestedObjectFieldProps>(({ field, parentPath, control, getValues }) => {
  const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
  const value = getValues(fieldPath) || {};

  // Get object keys from current value or provide common resume object keys
  const getObjectKeys = (fieldName: string, currentValue: any) => {
    if (currentValue && typeof currentValue === 'object' && Object.keys(currentValue).length > 0) {
      return Object.keys(currentValue);
    }

    // Provide default keys for known resume objects
    switch (fieldName) {
      case 'personalInfo':
        return ['name', 'title', 'email', 'phone', 'location', 'linkedin', 'github', 'website'];
      case 'skills':
        return ['technical', 'soft', 'tools'];
      default:
        return ['name', 'value'];
    }
  };

  const objectKeys = getObjectKeys(field.name, value);

  return (
    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
        {field.name.replace(/([A-Z])/g, ' $1').trim()}
      </h4>
      {objectKeys.map((key) => {
        const inputId = `${fieldPath.replace(/\./g, '-')}-${key}`;
        return (
          <div key={key}>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize"
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <Controller
              name={`${fieldPath}.${key}`}
              control={control}
              render={({ field: formField }) => (
                <input
                  {...formField}
                  id={inputId}
                  type="text"
                  className="form-input"
                  placeholder={`Enter ${key}`}
                />
              )}
            />
          </div>
        );
      })}
    </div>
  );
});

NestedObjectField.displayName = 'NestedObjectField';

// ArrayOfObjectsField Component
interface ArrayOfObjectsFieldProps {
  field: FieldDefinition;
  control: Control<any>;
}

const ArrayOfObjectsField = React.memo<ArrayOfObjectsFieldProps>(({ field, control }) => {
  const { fields: arrayFields, append, remove } = useFieldArray({
    control,
    name: field.name
  });

  const getDefaultObjectForField = (fieldName: string) => {
    switch (fieldName) {
      case 'experience':
        return { company: '', position: '', startDate: '', endDate: '', description: '', achievements: [] };
      case 'education':
        return { institution: '', degree: '', field: '', graduationDate: '', gpa: '' };
      case 'certifications':
        return { name: '', issuer: '', date: '', expiryDate: '', credentialId: '' };
      case 'languages':
        return { language: '', proficiency: '' };
      case 'projects':
        return { name: '', description: '', technologies: [], url: '' };
      default:
        return { name: '', value: '' };
    }
  };

  const getFieldsForObject = (fieldName: string) => {
    switch (fieldName) {
      case 'experience':
        return [
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'position', label: 'Position', type: 'text' },
          { key: 'startDate', label: 'Start Date', type: 'date' },
          { key: 'endDate', label: 'End Date', type: 'date' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'achievements', label: 'Achievements', type: 'array' }
        ];
      case 'education':
        return [
          { key: 'institution', label: 'Institution', type: 'text' },
          { key: 'degree', label: 'Degree', type: 'text' },
          { key: 'field', label: 'Field of Study', type: 'text' },
          { key: 'graduationDate', label: 'Graduation Date', type: 'date' },
          { key: 'gpa', label: 'GPA', type: 'text' }
        ];
      case 'certifications':
        return [
          { key: 'name', label: 'Certification Name', type: 'text' },
          { key: 'issuer', label: 'Issuer', type: 'text' },
          { key: 'date', label: 'Date Obtained', type: 'date' },
          { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
          { key: 'credentialId', label: 'Credential ID', type: 'text' }
        ];
      case 'languages':
        return [
          { key: 'language', label: 'Language', type: 'text' },
          { key: 'proficiency', label: 'Proficiency Level', type: 'text' }
        ];
      case 'projects':
        return [
          { key: 'name', label: 'Project Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'technologies', label: 'Technologies', type: 'array' },
          { key: 'url', label: 'Project URL', type: 'text' }
        ];
      default:
        return [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' }
        ];
    }
  };

  const objectFields = getFieldsForObject(field.name);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white capitalize">
          {field.name.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        <button
          type="button"
          onClick={() => append(getDefaultObjectForField(field.name))}
          className="btn-primary btn-sm"
        >
          Add {field.name.slice(0, -1)}
        </button>
      </div>

      {arrayFields.map((item, index) => (
        <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="font-medium text-gray-800 dark:text-gray-200">
              {field.name.charAt(0).toUpperCase() + field.name.slice(1, -1)} {index + 1}
            </h5>
            <button
              type="button"
              onClick={() => remove(index)}
              className="btn-danger btn-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {objectFields.map((objField) => {
              const fieldId = `field-${field.name}-${index}-${objField.key}`;
              return (
                <div key={objField.key} className={objField.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label
                    htmlFor={fieldId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {objField.label}
                  </label>
                  <Controller
                    name={`${field.name}.${index}.${objField.key}`}
                    control={control}
                    render={({ field: formField }) => {
                      if (objField.type === 'textarea') {
                        return (
                          <textarea
                            {...formField}
                            id={fieldId}
                            rows={3}
                            className="form-input"
                            placeholder={`Enter ${objField.label.toLowerCase()}`}
                          />
                        );
                      } else if (objField.type === 'date') {
                        return (
                          <input
                            {...formField}
                            id={fieldId}
                            type="date"
                            className="form-input"
                          />
                        );
                      } else if (objField.type === 'array') {
                        return (
                          <TagInput
                            value={formField.value || []}
                            onChange={formField.onChange}
                            placeholder={`Add ${objField.label.toLowerCase()}`}
                            id={fieldId}
                          />
                        );
                      } else {
                        return (
                          <input
                            {...formField}
                            id={fieldId}
                            type="text"
                            className="form-input"
                            placeholder={`Enter ${objField.label.toLowerCase()}`}
                          />
                        );
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {arrayFields.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No {field.name} added yet. Click "Add {field.name.slice(0, -1)}" to get started.
        </div>
      )}
    </div>
  );
});

ArrayOfObjectsField.displayName = 'ArrayOfObjectsField';

// FormField Component
interface FormFieldProps {
  field: FieldDefinition;
  control: Control<any>;
  error?: FieldError | { message?: string };
  getValues: UseFormGetValues<any>;
}

const FormField = React.memo<FormFieldProps>(({ field, control, error, getValues }) => {
  const fieldId = `field-${field.name}`;
  const baseClasses = "form-input";

  const renderInput = () => {
    switch (field.type) {
      case 'object':
        return <NestedObjectField field={field} parentPath="" control={control} getValues={getValues} />;

      case 'array':
        if (field.arrayType === 'object') {
          return <ArrayOfObjectsField field={field} control={control} />;
        }
        // Fall through to existing array handling for simple arrays
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <TagInput
                value={formField.value || []}
                onChange={formField.onChange}
                placeholder={`Add ${field.name}`}
                id={fieldId}
              />
            )}
          />
        );

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
                  required={field.required}
                  aria-required={field.required}
                >
                  <option value="">Select {field.name}</option>
                  {field.enumValues!.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
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
                value={formField.value ?? ''}
                type="text"
                id={fieldId}
                className={baseClasses}
                placeholder={`Enter ${field.name}`}
                required={field.required}
                aria-required={field.required}
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
                value={formField.value ?? ''}
                type="number"
                id={fieldId}
                className={baseClasses}
                placeholder={`Enter ${field.name}`}
                min={field.validation?.min}
                max={field.validation?.max}
                required={field.required}
                aria-required={field.required}
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
                  className="form-checkbox"
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
                required={field.required}
                aria-required={field.required}
                value={formField.value ? new Date(formField.value).toISOString().split('T')[0] : ''}
                onChange={(e) => formField.onChange(e.target.value ? new Date(e.target.value) : '')}
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
                value={formField.value ?? ''}
                type="text"
                id={fieldId}
                className={baseClasses}
                placeholder={`Enter ${field.name}`}
                required={field.required}
                aria-required={field.required}
              />
            )}
          />
        );
    }
  };

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderInput()}

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message as string}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

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
          } else if (field.arrayType === 'object') {
            // For arrays of objects, use a more flexible schema
            fieldSchema = z.array(z.record(z.any()));
          } else {
            fieldSchema = z.array(z.string());
          }
          break;
        case 'object':
          // For nested objects, use a flexible record schema
          fieldSchema = z.record(z.any());
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
        let value = processed[field.name];

        // Apply default value from schema if missing
        if (value === undefined && field.defaultValue !== undefined) {
          value = field.defaultValue;
          processed[field.name] = value;
        }

      // Convert date strings to Date objects for the form
      if (field.type === 'date' && value) {
        if (typeof value === 'string') {
          processed[field.name] = new Date(value);
        }
      }

      // Ensure arrays exist
      if (field.type === 'array' && !value) {
        processed[field.name] = [];
      }

      // Ensure objects exist
      if (field.type === 'object' && !value) {
        processed[field.name] = {};
      }
    });

    return processed;
  }, [defaultValues, data, schema.fields]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    getValues
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: processedDefaultValues,
    mode: 'onChange'
  });

  // Watch all form values for onChange callback
  const watchedValues = watch();
  
  // Use a ref to track the previous values to prevent unnecessary calls
  const prevValuesRef = useRef<Record<string, any>>();
  
  // Memoize the onChange callback to prevent it from changing on every render
  const memoizedOnChange = useCallback(onChange || (() => {}), []);

  useEffect(() => {
    // Only call onChange if values have actually changed
    if (memoizedOnChange && JSON.stringify(watchedValues) !== JSON.stringify(prevValuesRef.current)) {
      prevValuesRef.current = watchedValues;
      memoizedOnChange(watchedValues);
    }
  }, [watchedValues, memoizedOnChange]);

  // Register submit function with parent
  useEffect(() => {
    if (registerSubmitRef) {
      registerSubmitRef(() => {
        handleSubmit((data) => {
          if (onSubmit) {
            onSubmit(data);
          }
        })();
      });
    }
  }, [registerSubmitRef, handleSubmit, onSubmit]);

  const handleFormSubmit = (data: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={onSubmit ? handleSubmit(handleFormSubmit) : undefined} className="space-y-6">
      {schema.fields.map(field => (
        <FormField
          key={field.name}
          field={field}
          control={control}
          error={errors[field.name] as FieldError}
          getValues={getValues}
        />
      ))}

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
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

      const response = await adminFetch('admin/api/files/upload', {
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
      logger.error('Upload error:', error);
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
        className="btn-secondary cursor-pointer inline-flex items-center"
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
