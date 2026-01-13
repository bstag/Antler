import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FileItem } from '../../../components/admin/FileItem';

describe('FileItem', () => {
  const mockFile = {
    name: 'test-image.jpg',
    path: '/uploads/test-image.jpg',
    size: 1024,
    type: 'image' as const,
    modifiedAt: new Date().toISOString(),
  };

  const defaultProps = {
    file: mockFile,
    selected: false,
    onToggle: vi.fn(),
    onCopy: vi.fn(),
    copiedFile: null,
    viewMode: 'grid' as const,
  };

  it('renders View action as an accessible link in grid mode', () => {
    render(<FileItem {...defaultProps} viewMode="grid" />);

    // It should be a link, not a button
    // The link should have an aria-label "View test-image.jpg"
    const viewLink = screen.getByRole('link', { name: `View ${mockFile.name}` });

    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute('href', mockFile.path);
    expect(viewLink).toHaveAttribute('target', '_blank');
    expect(viewLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders View action as an accessible link in list mode', () => {
    render(<FileItem {...defaultProps} viewMode="list" />);

    // It should be a link, not a button
    const viewLink = screen.getByRole('link', { name: `View ${mockFile.name}` });

    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute('href', mockFile.path);
    expect(viewLink).toHaveAttribute('target', '_blank');
    expect(viewLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
