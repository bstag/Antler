import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Setup localStorage mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  
  // Setup matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
    value: matchMediaMock,
    writable: true,
  });
  
  // Mock document.documentElement methods
  Object.defineProperty(document.documentElement, 'setAttribute', {
    value: vi.fn(),
    writable: true,
  });
  
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    },
    writable: true,
  });
  
  // Mock fetch for API calls
  global.fetch = vi.fn();
  
  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Export mocks for use in tests
export { localStorageMock, matchMediaMock };