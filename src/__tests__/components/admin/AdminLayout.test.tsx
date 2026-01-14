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
});
