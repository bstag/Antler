import React from 'react';
import { render } from '@testing-library/react';

// Custom render function that can be extended with providers if needed
const customRender = (
  ui: React.ReactElement,
  options?: any
) => render(ui, options);

// Mock data for testing
export const mockBlogPost = {
  title: 'Test Blog Post',
  description: 'A test blog post description',
  publicationDate: new Date('2024-01-01'),
  tags: ['test', 'blog'],
  author: 'Test Author',
  readingTime: 5,
  featured: true,
};

export const mockProject = {
  projectName: 'Test Project',
  projectImage: '/images/test-project.jpg',
  description: 'A test project description',
  technologies: ['React', 'TypeScript'],
  githubLink: 'https://github.com/test/project',
  liveUrl: 'https://test-project.com',
  featured: true,
  createdAt: new Date('2024-01-01'),
};

export const mockDoc = {
  title: 'Test Documentation',
  description: 'Test documentation description',
  group: 'getting-started',
  order: 1,
};

export const mockFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test Subject',
  message: 'This is a test message',
};

// Helper to create mock fetch responses
export const createMockResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    headers: new Headers(),
  } as Response);
};

// Helper to wait for async operations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export * from '@testing-library/react';
export { customRender as render };