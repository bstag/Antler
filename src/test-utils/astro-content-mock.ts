import { vi } from 'vitest';

// Mock Astro content collections for testing
export const getCollection = vi.fn();
export const getEntry = vi.fn();
export const getEntries = vi.fn();

// Define collection types for testing
export type CollectionEntry<T> = {
  slug: string;
  data: Record<string, any>;
  body?: string;
};
