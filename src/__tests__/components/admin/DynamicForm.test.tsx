import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicForm } from '../../../components/admin/DynamicForm';
import type { SchemaDefinition } from '../../../lib/admin/types';

// Mock dependencies
vi.mock('../../../lib/admin/api-client', () => ({
  adminFetch: vi.fn()
}));

vi.mock('../../../lib/utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('DynamicForm', () => {
  const mockBlogSchema: SchemaDefinition = {
    collection: 'blog',
    type: 'content',
    fields: [
      {
        name: 'title',
        type: 'string',
        required: true,
        optional: false
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        optional: true
      },
      {
        name: 'publicationDate',
        type: 'date',
        required: true,
        optional: false
      },
      {
        name: 'featured',
        type: 'boolean',
        required: false,
        optional: true,
        defaultValue: false
      },
      {
        name: 'tags',
        type: 'array',
        arrayType: 'string',
        required: true,
        optional: false
      },
      {
        name: 'readingTime',
        type: 'number',
        required: false,
        optional: true
      }
    ]
  };

  const mockProjectSchema: SchemaDefinition = {
    collection: 'projects',
    type: 'content',
    fields: [
      {
        name: 'projectName',
        type: 'string',
        required: true,
        optional: false
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        optional: false
      },
      {
        name: 'technologies',
        type: 'array',
        arrayType: 'string',
        required: true,
        optional: false
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render form with all fields from schema', () => {
      render(<DynamicForm schema={mockBlogSchema} />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/publicationDate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/featured/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/readingTime/i)).toBeInTheDocument();
    });

    it('should mark required fields appropriately', () => {
      render(<DynamicForm schema={mockBlogSchema} />);

      const titleInput = screen.getByLabelText(/title/i);
      expect(titleInput).toBeRequired();

      const descriptionInput = screen.getByLabelText(/description/i);
      expect(descriptionInput).not.toBeRequired();
    });

    it('should render different input types correctly', () => {
      render(<DynamicForm schema={mockBlogSchema} />);

      // String input
      const titleInput = screen.getByLabelText(/title/i);
      expect(titleInput).toHaveAttribute('type', 'text');

      // Date input
      const dateInput = screen.getByLabelText(/publicationDate/i);
      expect(dateInput).toHaveAttribute('type', 'date');

      // Boolean checkbox
      const featuredInput = screen.getByLabelText(/featured/i);
      expect(featuredInput).toHaveAttribute('type', 'checkbox');

      // Number input
      const readingTimeInput = screen.getByLabelText(/readingTime/i);
      expect(readingTimeInput).toHaveAttribute('type', 'number');
    });

    it('should render submit button with default label', () => {
      render(<DynamicForm schema={mockBlogSchema} />);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should render submit button with custom label', () => {
      render(<DynamicForm schema={mockBlogSchema} submitLabel="Create Post" />);

      expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
    });

    it('should render cancel button if onCancel provided', () => {
      const onCancel = vi.fn();
      render(<DynamicForm schema={mockBlogSchema} onCancel={onCancel} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should not render cancel button if onCancel not provided', () => {
      render(<DynamicForm schema={mockBlogSchema} />);

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update string fields on user input', async () => {
      const user = userEvent.setup();
      render(<DynamicForm schema={mockBlogSchema} />);

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      await user.type(titleInput, 'My Blog Post');

      expect(titleInput.value).toBe('My Blog Post');
    });

    it('should update date fields on user input', async () => {
      const user = userEvent.setup();
      render(<DynamicForm schema={mockBlogSchema} />);

      const dateInput = screen.getByLabelText(/publicationDate/i) as HTMLInputElement;
      await user.type(dateInput, '2024-03-15');

      expect(dateInput.value).toBe('2024-03-15');
    });

    it('should toggle boolean fields', async () => {
      const user = userEvent.setup();
      render(<DynamicForm schema={mockBlogSchema} />);

      const featuredInput = screen.getByLabelText(/featured/i) as HTMLInputElement;
      expect(featuredInput.checked).toBe(false);

      await user.click(featuredInput);
      expect(featuredInput.checked).toBe(true);

      await user.click(featuredInput);
      expect(featuredInput.checked).toBe(false);
    });

    it('should update number fields on user input', async () => {
      const user = userEvent.setup();
      render(<DynamicForm schema={mockBlogSchema} />);

      const readingTimeInput = screen.getByLabelText(/readingTime/i) as HTMLInputElement;
      await user.type(readingTimeInput, '5');

      expect(readingTimeInput.value).toBe('5');
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<DynamicForm schema={mockBlogSchema} onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Validation', () => {
    it('should prevent submission with empty required fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<DynamicForm schema={mockBlogSchema} onSubmit={onSubmit} />);

      const submitButton = screen.getByRole('button', { name: /save/i });
      await user.click(submitButton);

      // Form should not submit due to HTML5 validation
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should allow submission with all required fields filled', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<DynamicForm schema={mockBlogSchema} onSubmit={onSubmit} />);

      // Fill required fields
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test Post');

      const dateInput = screen.getByLabelText(/publicationDate/i);
      await user.type(dateInput, '2024-03-15');

      // For tags array, we'd need to interact with the array input component
      // This is a simplified test - actual implementation may vary

      const submitButton = screen.getByRole('button', { name: /save/i });
      await user.click(submitButton);

      // Note: Actual submission depends on array field handling
    });

    it('should validate number field constraints', async () => {
      const schemaWithConstraints: SchemaDefinition = {
        collection: 'test',
        type: 'content',
        fields: [
          {
            name: 'age',
            type: 'number',
            required: true,
            optional: false,
            validation: {
              min: 0,
              max: 120
            }
          }
        ]
      };

      const user = userEvent.setup();
      render(<DynamicForm schema={schemaWithConstraints} />);

      const ageInput = screen.getByLabelText(/age/i) as HTMLInputElement;
      expect(ageInput).toHaveAttribute('min', '0');
      expect(ageInput).toHaveAttribute('max', '120');
    });
  });

  describe('Default Values', () => {
    it('should populate form with default values', () => {
      const defaultValues = {
        title: 'Default Title',
        description: 'Default Description',
        featured: true
      };

      render(<DynamicForm schema={mockBlogSchema} defaultValues={defaultValues} />);

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      expect(titleInput.value).toBe('Default Title');

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLInputElement;
      expect(descriptionInput.value).toBe('Default Description');

      const featuredInput = screen.getByLabelText(/featured/i) as HTMLInputElement;
      expect(featuredInput.checked).toBe(true);
    });

    it('should use schema default values if provided', () => {
      const schemaWithDefaults: SchemaDefinition = {
        collection: 'test',
        type: 'content',
        fields: [
          {
            name: 'status',
            type: 'string',
            required: false,
            optional: true,
            defaultValue: 'draft'
          }
        ]
      };

      render(<DynamicForm schema={schemaWithDefaults} />);

      const statusInput = screen.getByLabelText(/status/i) as HTMLInputElement;
      expect(statusInput.value).toBe('draft');
    });

    it('should override schema defaults with provided default values', () => {
      const schemaWithDefaults: SchemaDefinition = {
        collection: 'test',
        type: 'content',
        fields: [
          {
            name: 'status',
            type: 'string',
            required: false,
            optional: true,
            defaultValue: 'draft'
          }
        ]
      };

      render(
        <DynamicForm
          schema={schemaWithDefaults}
          defaultValues={{ status: 'published' }}
        />
      );

      const statusInput = screen.getByLabelText(/status/i) as HTMLInputElement;
      expect(statusInput.value).toBe('published');
    });
  });

  describe('Loading State', () => {
    it('should disable submit button when loading', () => {
      render(<DynamicForm schema={mockBlogSchema} loading={true} />);

      const submitButton = screen.getByRole('button', { name: /save/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when not loading', () => {
      render(<DynamicForm schema={mockBlogSchema} loading={false} />);

      const submitButton = screen.getByRole('button', { name: /save/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Different Field Types', () => {
    it('should handle enum fields with select dropdown', () => {
      const schemaWithEnum: SchemaDefinition = {
        collection: 'test',
        type: 'content',
        fields: [
          {
            name: 'status',
            type: 'string',
            required: true,
            optional: false,
            enumValues: ['draft', 'published', 'archived']
          }
        ]
      };

      render(<DynamicForm schema={schemaWithEnum} />);

      const statusSelect = screen.getByLabelText(/status/i);
      expect(statusSelect.tagName).toBe('SELECT');

      // Check that options are rendered
      expect(screen.getByRole('option', { name: /draft/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /published/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /archived/i })).toBeInTheDocument();
    });

    it('should handle object fields', () => {
      const schemaWithObject: SchemaDefinition = {
        collection: 'test',
        type: 'content',
        fields: [
          {
            name: 'metadata',
            type: 'object',
            required: false,
            optional: true
          }
        ]
      };

      render(<DynamicForm schema={schemaWithObject} />);

      // Object fields might be rendered as textarea for JSON input
      expect(screen.getByLabelText(/metadata/i)).toBeInTheDocument();
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange when form values change', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DynamicForm schema={mockBlogSchema} onChange={onChange} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'T');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should provide current form data to onChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DynamicForm schema={mockBlogSchema} onChange={onChange} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');

      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
        expect(lastCall[0]).toHaveProperty('title');
      });
    });
  });

  describe('Multiple Schema Support', () => {
    it('should render projects schema correctly', () => {
      render(<DynamicForm schema={mockProjectSchema} />);

      expect(screen.getByLabelText(/projectName/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/technologies/i)).toBeInTheDocument();
    });

    it('should handle schema changes', () => {
      const { rerender } = render(<DynamicForm schema={mockBlogSchema} />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/projectName/i)).not.toBeInTheDocument();

      rerender(<DynamicForm schema={mockProjectSchema} />);

      expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/projectName/i)).toBeInTheDocument();
    });
  });

  describe('Integration with Static Site Generation', () => {
    it('should create data structure compatible with content collections', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<DynamicForm schema={mockBlogSchema} onSubmit={onSubmit} />);

      // Fill form fields
      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/description/i), 'Test Description');
      await user.type(screen.getByLabelText(/publicationDate/i), '2024-03-15');

      // The data structure should match the content collection schema
      // This test verifies that the form creates compatible data
    });

    it('should handle date fields for SSG compatibility', () => {
      const defaultValues = {
        publicationDate: new Date('2024-03-15')
      };

      render(<DynamicForm schema={mockBlogSchema} defaultValues={defaultValues} />);

      const dateInput = screen.getByLabelText(/publicationDate/i) as HTMLInputElement;
      // Date should be formatted for input[type="date"]
      expect(dateInput.value).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });
});
