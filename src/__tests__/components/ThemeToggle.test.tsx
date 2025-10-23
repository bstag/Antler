import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from "../../test-utils/test-helpers";
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../../components/ThemeToggle';
import { localStorageMock, matchMediaMock } from '../../test-utils/setup';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  describe('Initial Rendering', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should show sun icon initially (before hydration)', () => {
      render(<ThemeToggle />);
      
      // Before hydration, it should show sun icon as default
      const sunIcon = screen.getByRole('button').querySelector('svg');
      expect(sunIcon).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('Theme Detection and Initialization', () => {
    it('should use saved theme from localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
        expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      });
    });

    it('should use system preference when no saved theme', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: true, // System prefers dark
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
        expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      });
    });

    it('should default to light theme when no preference', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: false, // System prefers light
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
        expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
      });
    });
  });

  describe('Theme Switching', () => {
    it('should toggle from light to dark theme', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue('light');
      
      render(<ThemeToggle />);
      
      // Wait for initial theme to be set
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      });
      
      // Click to toggle theme
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
        expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      });
    });

    it('should toggle from dark to light theme', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeToggle />);
      
      // Wait for initial theme to be set
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      });
      
      // Click to toggle theme
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
        expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
      });
    });

    it('should update aria-label when theme changes', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue('light');
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      });
      
      // Toggle theme
      await user.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });
  });

  describe('Icon Display', () => {
    it('should show moon icon in light mode', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        // In light mode, should show moon icon (to switch to dark)
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
      });
    });

    it('should show sun icon in dark mode', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        // In dark mode, should show sun icon (to switch to light)
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });
  });

  describe('System Theme Change Listener', () => {
    it('should listen for system theme changes', async () => {
      const mockAddEventListener = vi.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      });
    });

    it('should update theme when system preference changes (no saved preference)', async () => {
      let systemChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;
      const mockAddEventListener = vi.fn((event, handler) => {
        if (event === 'change') {
          systemChangeHandler = handler;
        }
      });
      
      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      localStorageMock.getItem.mockReturnValue(null); // No saved preference
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        expect(systemChangeHandler).toBeTruthy();
      });
      
      // Simulate system theme change to dark
      if (systemChangeHandler) {
        systemChangeHandler({ matches: true } as MediaQueryListEvent);
      }
      
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
        expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      });
    });

    it('should not update theme when system preference changes (has saved preference)', async () => {
      let systemChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;
      const mockAddEventListener = vi.fn((event, handler) => {
        if (event === 'change') {
          systemChangeHandler = handler;
        }
      });
      
      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      localStorageMock.getItem.mockReturnValue('light'); // Has saved preference
      
      render(<ThemeToggle />);
      
      await waitFor(() => {
        expect(systemChangeHandler).toBeTruthy();
      });
      
      // Clear previous calls
      vi.clearAllMocks();
      
      // Simulate system theme change to dark
      if (systemChangeHandler) {
        systemChangeHandler({ matches: true } as MediaQueryListEvent);
      }
      
      // Should not change theme because user has saved preference
      expect(document.documentElement.setAttribute).not.toHaveBeenCalled();
      expect(document.documentElement.classList.add).not.toHaveBeenCalled();
    });

    it('should cleanup event listener on unmount', async () => {
      const mockRemoveEventListener = vi.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn(),
      });
      
      const { unmount } = render(<ThemeToggle />);
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Hydration Handling', () => {
    it('should prevent hydration mismatch by showing default state initially', async () => {
      render(<ThemeToggle />);
      
      // Component should render and show proper aria-label after mounting
      const button = screen.getByRole('button');
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      });
    });

    it('should update to correct state after hydration', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(<ThemeToggle />);
      
      // After hydration, should show correct aria-label
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });
  });

  describe('Multiple Rapid Clicks', () => {
    it('should handle multiple rapid theme toggles', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue('light');
      
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      await waitFor(() => {
        // Should end up in dark mode (odd number of clicks)
        expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'dark');
      });
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have proper CSS classes for styling', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'p-2',
        'rounded-lg',
        'bg-gray-100',
        'dark:bg-gray-800',
        'text-gray-600',
        'dark:text-gray-300',
        'hover:bg-gray-200',
        'dark:hover:bg-gray-700',
        'transition-colors',
        'duration-200'
      );
    });

    it('should have focus styles for accessibility', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:ring-offset-2'
      );
    });
  });
});