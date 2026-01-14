import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentList } from '../../../../src/components/admin/ContentList';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ collection: 'blog' }),
  };
});

describe('ContentList Accessibility', () => {
  const mockSchemas = {
    blog: {
      name: 'blog',
      fields: [],
    },
  };

  test('search input has aria-label', () => {
    render(
      <BrowserRouter>
        <ContentList schemas={mockSchemas} />
      </BrowserRouter>
    );

    const searchInput = screen.getByLabelText(/Search blog/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('sort dropdowns have aria-labels', () => {
    render(
      <BrowserRouter>
        <ContentList schemas={mockSchemas} />
      </BrowserRouter>
    );

    const sortField = screen.getByLabelText('Sort by field');
    const sortOrder = screen.getByLabelText('Sort order');

    expect(sortField).toBeInTheDocument();
    expect(sortOrder).toBeInTheDocument();
  });
});
