import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminLayout } from '../../../../src/components/admin/AdminLayout';
import { BrowserRouter } from 'react-router-dom';

describe('AdminLayout Accessibility', () => {
  const mockSchemas = {};

  test('sidebar toggle button has aria-label', () => {
    render(
      <BrowserRouter>
        <AdminLayout schemas={mockSchemas}>
          <div>Content</div>
        </AdminLayout>
      </BrowserRouter>
    );

    // Initial state is open, so label should be "Close sidebar"
    const toggleButton = screen.getByLabelText('Close sidebar');
    expect(toggleButton).toBeInTheDocument();
  });

  test('has skip to main content link', () => {
    render(
      <BrowserRouter>
        <AdminLayout schemas={mockSchemas}>
          <div>Content</div>
        </AdminLayout>
      </BrowserRouter>
    );

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveAttribute('tabIndex', '-1');
  });
});
