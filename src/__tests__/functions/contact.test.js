import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onRequestPost, onRequestOptions } from '../../../functions/contact.js';

// Mock fetch globally
global.fetch = vi.fn();

// Helper function to create mock context
const createMockContext = (body, env = {}) => ({
  request: {
    json: vi.fn().mockResolvedValue(body)
  },
  env
});

describe('Contact Serverless Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  describe('onRequestPost', () => {

    describe('Input Validation', () => {
      it('should return 400 when name is missing', async () => {
        const context = createMockContext({
          email: 'test@example.com',
          message: 'Test message'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name, email, and message are required');
        expect(response.headers.get('Content-Type')).toBe('application/json');
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      });

      it('should return 400 when email is missing', async () => {
        const context = createMockContext({
          name: 'John Doe',
          message: 'Test message'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name, email, and message are required');
      });

      it('should return 400 when message is missing', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name, email, and message are required');
      });

      it('should return 400 for invalid email format', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'invalid-email',
          message: 'Test message'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Please provide a valid email address');
      });

      it('should accept valid email formats', async () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@example.org',
          'user123@test-domain.com'
        ];

        for (const email of validEmails) {
          const context = createMockContext({
            name: 'John Doe',
            email,
            message: 'Test message'
          });

          const response = await onRequestPost(context);
          expect(response.status).not.toBe(400);
        }
      });

      it('should reject invalid email formats', async () => {
        const invalidEmails = [
          'plainaddress',
          '@missingdomain.com',
          'missing@.com',
          'missing.domain@.com',
          'spaces @domain.com',
          'double@@domain.com'
        ];

        for (const email of invalidEmails) {
          const context = createMockContext({
            name: 'John Doe',
            email,
            message: 'Test message'
          });

          const response = await onRequestPost(context);
          const data = await response.json();
          expect(response.status).toBe(400);
          expect(data.error).toBe('Please provide a valid email address');
        }
      });
    });

    describe('Email Sending - Resend API', () => {
      it('should send email using Resend API when API key is provided', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ id: 'email-id' })
        });
        global.fetch = mockFetch;

        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message'
        }, {
          RESEND_API_KEY: 'test-resend-key',
          CONTACT_EMAIL: 'contact@example.com',
          FROM_EMAIL: 'noreply@example.com'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Thank you for your message! We\'ll get back to you soon.');

        expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-resend-key',
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('John Doe')
        });
      });

      it('should handle Resend API failure', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400
        });
        global.fetch = mockFetch;

        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Test message'
        }, {
          RESEND_API_KEY: 'test-resend-key'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to send message. Please try again later.');
      });
    });

    describe('Email Sending - SendGrid API', () => {
      it('should send email using SendGrid API when API key is provided', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ message: 'success' })
        });
        global.fetch = mockFetch;

        const context = createMockContext({
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'SendGrid Test',
          message: 'SendGrid test message'
        }, {
          SENDGRID_API_KEY: 'test-sendgrid-key',
          CONTACT_EMAIL: 'contact@example.com',
          FROM_EMAIL: 'noreply@example.com'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        expect(mockFetch).toHaveBeenCalledWith('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-sendgrid-key',
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Jane Smith')
        });
      });

      it('should handle SendGrid API failure', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 401
        });
        global.fetch = mockFetch;

        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Test message'
        }, {
          SENDGRID_API_KEY: 'invalid-key'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to send message. Please try again later.');
      });
    });

    describe('Fallback Behavior', () => {
      it('should log message when no API keys are provided', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(console.log).toHaveBeenCalledWith('Contact form submission:', expect.objectContaining({
          to: 'your-email@example.com',
          from: 'noreply@yourdomain.com',
          subject: 'Contact Form: Test Subject'
        }));
      });

      it('should use default values for missing environment variables', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Test message'
        });

        await onRequestPost(context);

        expect(console.log).toHaveBeenCalledWith('Contact form submission:', expect.objectContaining({
          to: 'your-email@example.com',
          from: 'noreply@yourdomain.com'
        }));
      });
    });

    describe('Email Content Generation', () => {
      it('should generate proper email content with all fields', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Website Inquiry',
          message: 'Hello,\nI have a question about your services.\n\nThanks!'
        });

        await onRequestPost(context);

        expect(console.log).toHaveBeenCalledWith('Contact form submission:', expect.objectContaining({
          subject: 'Contact Form: Website Inquiry',
          text: expect.stringContaining('Name: John Doe'),
          html: expect.stringContaining('<strong>Name:</strong> John Doe')
        }));
      });

      it('should handle missing subject field', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message'
        });

        await onRequestPost(context);

        expect(console.log).toHaveBeenCalledWith('Contact form submission:', expect.objectContaining({
          subject: 'Contact Form: New Message',
          text: expect.stringContaining('Subject: No subject'),
          html: expect.stringContaining('<strong>Subject:</strong> No subject')
        }));
      });

      it('should convert newlines to <br> tags in HTML content', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Line 1\nLine 2\nLine 3'
        });

        await onRequestPost(context);

        expect(console.log).toHaveBeenCalledWith('Contact form submission:', expect.objectContaining({
          html: expect.stringContaining('Line 1<br>Line 2<br>Line 3')
        }));
      });
    });

    describe('CORS Headers', () => {
      it('should include CORS headers in success response', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Test message'
        });

        const response = await onRequestPost(context);

        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
        expect(response.headers.get('Content-Type')).toBe('application/json');
      });

      it('should include CORS headers in error response', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'invalid-email',
          message: 'Test message'
        });

        const response = await onRequestPost(context);

        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
        expect(response.headers.get('Content-Type')).toBe('application/json');
      });

      it('should include CORS headers in server error response', async () => {
        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Test message'
        }, {
          RESEND_API_KEY: 'test-key'
        });

        // Mock fetch to throw an error
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const response = await onRequestPost(context);

        expect(response.status).toBe(500);
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
        expect(response.headers.get('Content-Type')).toBe('application/json');
      });
    });

    describe('Error Handling', () => {
      it('should handle JSON parsing errors', async () => {
        const context = {
          request: {
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
          },
          env: {}
        };

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to send message. Please try again later.');
        expect(console.error).toHaveBeenCalledWith('Contact form error:', expect.any(Error));
      });

      it('should handle network errors during email sending', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network timeout'));

        const context = createMockContext({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Test message'
        }, {
          RESEND_API_KEY: 'test-key'
        });

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to send message. Please try again later.');
      });
    });
  });

  describe('onRequestOptions (CORS Preflight)', () => {
    it('should return proper CORS preflight response', async () => {
      const response = await onRequestOptions();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });

    it('should return null body for preflight request', async () => {
      const response = await onRequestOptions();
      const text = await response.text();

      expect(text).toBe('');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete successful flow with Resend', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'email-123' })
      });
      global.fetch = mockFetch;

      const context = createMockContext({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Partnership Inquiry',
        message: 'I would like to discuss a potential partnership opportunity.'
      }, {
        RESEND_API_KEY: 'resend_key_123',
        CONTACT_EMAIL: 'partnerships@company.com',
        FROM_EMAIL: 'contact@company.com'
      });

      const response = await onRequestPost(context);
      const data = await response.json();

      // Verify response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Thank you for your message');

      // Verify API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer resend_key_123',
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('Alice Johnson')
      }));

      // Verify CORS headers
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should prioritize Resend over SendGrid when both keys are present', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'email-123' })
      });
      global.fetch = mockFetch;

      const context = createMockContext({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      }, {
        RESEND_API_KEY: 'resend_key',
        SENDGRID_API_KEY: 'sendgrid_key'
      });

      await onRequestPost(context);

      // Should call Resend API, not SendGrid
      expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', expect.any(Object));
      expect(mockFetch).not.toHaveBeenCalledWith('https://api.sendgrid.com/v3/mail/send', expect.any(Object));
    });
  });
});