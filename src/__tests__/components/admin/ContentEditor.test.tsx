import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContentEditor } from '../../../components/admin/ContentEditor';
import { adminFetch } from '../../../lib/admin/api-client';

// Mock adminFetch
vi.mock('../../../lib/admin/api-client', () => ({
  adminFetch: vi.fn(),
}));

// Mock logger
vi.mock('../../../lib/utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock schema
const mockSchema = {
  blog: {
    collection: 'blog',
    type: 'content',
    fields: [
      { name: 'title', type: 'string', required: true, optional: false },
      { name: 'description', type: 'string', required: true, optional: false },
    ],
  },
};

describe('ContentEditor Keyboard Shortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    (adminFetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: '123',
          title: 'Test Post',
          frontmatter: { title: 'Test Post', description: 'Test Desc' },
          content: 'Test Content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slug: 'test-post'
        },
      }),
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/admin/content/blog/123']}>
        <Routes>
          <Route
            path="/admin/content/:collection/:id"
            element={<ContentEditor schemas={mockSchema as any} />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should switch tabs with Ctrl+1 and Ctrl+2', async () => {
    renderComponent();

    // Wait for loading to finish and metadata tab to be active
    await waitFor(() => expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument());

    // Initially on Metadata tab
    // Press Ctrl+2 to switch to Content tab
    fireEvent.keyDown(window, { key: '2', ctrlKey: true });

    // Check if content editor is visible
    await waitFor(() => {
        expect(screen.getByPlaceholderText(/Write your blog content here/i)).toBeInTheDocument();
    });

    // Press Ctrl+1 to switch back to Metadata tab
    fireEvent.keyDown(window, { key: '1', ctrlKey: true });

    await waitFor(() => {
        expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument();
    });
  });

  it('should save with Ctrl+S', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument());

    // Press Ctrl+S
    fireEvent.keyDown(window, { key: 's', ctrlKey: true });

    // Verify save called
    await waitFor(() => {
      expect(adminFetch).toHaveBeenCalledWith(
        expect.stringContaining('admin/api/content/blog/123'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  it('should cancel with Esc', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument());

    // Press Esc
    fireEvent.keyDown(window, { key: 'Escape' });

    // Verify navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/content/blog');
    });
  });
});
