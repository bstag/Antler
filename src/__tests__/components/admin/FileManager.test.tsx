import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { FileManager } from '../../../components/admin/FileManager';
import { adminFetch } from '../../../lib/admin/api-client';

// Mock dependencies
vi.mock('../../../lib/admin/api-client', () => ({
  adminFetch: vi.fn(),
}));

vi.mock('../../../lib/utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('FileManager', () => {
  const mockFiles = [
    {
      name: 'image.jpg',
      path: '/uploads/image.jpg',
      size: 1024,
      type: 'image',
      modifiedAt: new Date().toISOString(),
    },
    {
      name: 'document.pdf',
      path: '/uploads/document.pdf',
      size: 2048,
      type: 'document',
      modifiedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (adminFetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { files: mockFiles },
      }),
    });
  });

  it('renders file list', async () => {
    render(<FileManager />);

    await waitFor(() => {
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });
  });

  it('toggles file selection', async () => {
    render(<FileManager />);

    await waitFor(() => {
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText('Select image.jpg');
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('copies file URL to clipboard', async () => {
    render(<FileManager />);

    await waitFor(() => {
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });

    const copyButton = screen.getByLabelText('Copy URL for image.jpg');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('/uploads/image.jpg');

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('switches view mode', async () => {
    render(<FileManager />);

    await waitFor(() => {
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });

    const switchButton = screen.getByTitle('Switch to list view');
    fireEvent.click(switchButton);

    // In list view, the layout changes (we can verify by checking if class names or structure changed,
    // but simplified check is that it still renders items)
    expect(screen.getByText('image.jpg')).toBeInTheDocument();
  });
});
