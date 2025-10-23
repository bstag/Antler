import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test-utils/test-helpers';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../components/ContactForm';
import { createMockResponse } from '../../test-utils/test-helpers';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<ContactForm />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should have proper form field attributes', () => {
      render(<ContactForm />);
      
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const subjectField = screen.getByLabelText(/subject/i);
      const messageField = screen.getByLabelText(/message/i);
      
      expect(nameField).toHaveAttribute('type', 'text');
      expect(nameField).toHaveAttribute('required');
      expect(emailField).toHaveAttribute('type', 'email');
      expect(emailField).toHaveAttribute('required');
      expect(subjectField).toHaveAttribute('type', 'text');
      expect(subjectField).not.toHaveAttribute('required');
      expect(messageField).toHaveAttribute('required');
    });

    it('should have proper placeholders', () => {
      render(<ContactForm />);
      
      expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('What\'s this about?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tell me about your project, question, or just say hello!')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update form fields when user types', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const nameField = screen.getByLabelText(/name/i);
      const emailField = screen.getByLabelText(/email/i);
      const subjectField = screen.getByLabelText(/subject/i);
      const messageField = screen.getByLabelText(/message/i);
      
      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(subjectField, 'Test Subject');
      await user.type(messageField, 'Test message content');
      
      expect(nameField).toHaveValue('John Doe');
      expect(emailField).toHaveValue('john@example.com');
      expect(subjectField).toHaveValue('Test Subject');
      expect(messageField).toHaveValue('Test message content');
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        success: true, 
        message: 'Message sent successfully' 
      }));
      
      render(<ContactForm />);
      
      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      // Wait for form to clear
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/message/i)).toHaveValue('');
      });
    });
  });

  describe('Form Validation', () => {
    it('should prevent submission with empty required fields', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Form should not be submitted (fetch should not be called)
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should allow submission with only required fields filled', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        success: true, 
        message: 'Message sent successfully' 
      }));
      
      render(<ContactForm />);
      
      // Fill only required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/functions/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            subject: '',
            message: 'Test message',
          }),
        });
      });
    });
  });

  describe('API Integration', () => {
    it('should call the correct API endpoint with form data', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        success: true, 
        message: 'Message sent successfully' 
      }));
      
      render(<ContactForm />);
      
      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'Test message content');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/functions/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Test Subject',
            message: 'Test message content',
          }),
        });
      });
    });

    it('should handle successful API response', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        success: true, 
        message: 'Thank you! Your message has been sent successfully.' 
      }));
      
      render(<ContactForm />);
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      // Check for success message
      await waitFor(() => {
        expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument();
      });
      
      // Check that error message is not shown
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('should handle API error response', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        error: 'Server error occurred' 
      }, 500));
      
      render(<ContactForm />);
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
      });
      
      // Check that success message is not shown
      expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    });

    it('should handle network error', async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<ContactForm />);
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should handle 404 response with fallback', async () => {
      const user = userEvent.setup();
      // First call returns 404, second call (fallback) returns success
      mockFetch
        .mockResolvedValueOnce(createMockResponse({ error: 'Not found' }, 404))
        .mockResolvedValueOnce(createMockResponse({ 
          success: true, 
          message: 'Message received! (Static deployment mode)' 
        }));
      
      render(<ContactForm />);
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      // Should show success message from fallback
      await waitFor(() => {
        expect(screen.getByText(/message received! \(static deployment mode\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValueOnce(pendingPromise);
      
      render(<ContactForm />);
      
      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Submit form
      await user.click(submitButton);
      
      // Should show "Sending..." text
      await waitFor(() => {
        expect(screen.getByText(/sending/i)).toBeInTheDocument();
      });
      
      // Resolve promise
      resolvePromise!({ 
        ok: true, 
        json: () => Promise.resolve({ success: true, message: 'Success' }) 
      });
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/sending/i)).not.toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValueOnce(pendingPromise);
      
      render(<ContactForm />);
      
      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Submit form (but don't resolve promise yet)
      await user.click(submitButton);

      // Wait for the button to be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Resolve promise
      resolvePromise!({ 
        ok: true, 
        json: () => Promise.resolve({ success: true, message: 'Success' }) 
      });
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Console Logging', () => {
    it('should log form submission details', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'log');
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        success: true, 
        message: 'Success' 
      }));
      
      render(<ContactForm />);
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Form submission started with data:', {
          name: 'John Doe',
          email: 'john@example.com',
          subject: '',
          message: 'Test message',
        });
      });
    });
  });
});