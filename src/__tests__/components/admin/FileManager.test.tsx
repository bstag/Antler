import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileManager } from '../../../../src/components/admin/FileManager';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import React from 'react';

// Mock adminFetch
vi.mock('../../../../src/lib/admin/api-client', () => ({
  adminFetch: vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      success: true,
      data: {
        files: [
          {
            name: 'test-image.jpg',
            path: '/uploads/images/test-image.jpg',
            size: 1024,
            type: 'image',
            modifiedAt: new Date().toISOString()
          }
        ]
      }
    })
  }))
}));

// Mock logger
vi.mock('../../../../src/lib/utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn()
  }
}));

describe('FileManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve())
      }
    });
  });

  test('renders file list and allows view in new tab', async () => {
    render(<FileManager />);

    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    });

    // Check View button
    const viewButton = screen.getByLabelText('View test-image.jpg in new tab');
    expect(viewButton).toBeInTheDocument();
    expect(viewButton.tagName).toBe('A');
    expect(viewButton).toHaveAttribute('href', '/uploads/images/test-image.jpg');
    expect(viewButton).toHaveAttribute('target', '_blank');
    expect(viewButton).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('shows drag and drop feedback', async () => {
    render(<FileManager />);

    // Initial state
    expect(screen.getByText(/Drag and drop files here/i)).toBeInTheDocument();
    const dropZone = screen.getByText(/Drag and drop files here/i).closest('div');

    // Simulate drag over
    fireEvent.dragOver(dropZone!);

    // Active state
    expect(screen.getByText(/Drop files to upload!/i)).toBeInTheDocument();
    expect(dropZone).toHaveClass('border-blue-500');

    // Simulate drag leave
    fireEvent.dragLeave(dropZone!);

    // Return to initial state
    expect(screen.getByText(/Drag and drop files here/i)).toBeInTheDocument();
    expect(dropZone).not.toHaveClass('border-blue-500');
  });
});
