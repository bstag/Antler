import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContentList } from '../../../../src/components/admin/ContentList';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ collection: 'blog' }),
  };
});

describe('ContentList UX Enhancements', () => {
  const mockSchemas = {
    blog: {
      name: 'blog',
      fields: [],
    },
  };

  const mockData = {
    success: true,
    data: {
      items: [
        { id: '1', title: 'Post 1', updatedAt: new Date().toISOString(), frontmatter: {} },
        { id: '2', title: 'Post 2', updatedAt: new Date().toISOString(), frontmatter: {} },
      ],
      total: 20, // ensure pagination shows
      hasMore: true
    }
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData
    });
  });

  test('search input shows clear button when text is entered', async () => {
    render(
      <BrowserRouter>
        <ContentList schemas={mockSchemas} />
      </BrowserRouter>
    );

    const searchInput = screen.getByLabelText(/Search blog/i);

    // Initially clear button should not be visible (or not exist)
    const clearButtonQuery = screen.queryByLabelText('Clear search');
    expect(clearButtonQuery).not.toBeInTheDocument();

    // Type into search input
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Clear button should now be visible
    const clearButton = await screen.findByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearButton);

    // Search input should be cleared
    expect(searchInput).toHaveValue('');

    // Clear button should disappear
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  test('pagination buttons have aria-labels', async () => {
    render(
      <BrowserRouter>
        <ContentList schemas={mockSchemas} />
      </BrowserRouter>
    );

    // Wait for data to load and pagination to appear
    await waitFor(() => {
      // Find text "20 items" which indicates loading is complete and total is shown
      expect(screen.getByText(/20 items/i)).toBeInTheDocument();
    });

    // Check for previous button aria-label (desktop)
    // Note: There are two sets of pagination controls (mobile and desktop)
    // We just need to check if AT LEAST ONE has the label, or better, all of them.
    const prevButtons = screen.getAllByLabelText('Go to previous page');
    expect(prevButtons.length).toBeGreaterThan(0);

    const nextButtons = screen.getAllByLabelText('Go to next page');
    expect(nextButtons.length).toBeGreaterThan(0);
  });
});
