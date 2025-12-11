import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/pages/admin/api/files/upload';
import { GET } from '@/pages/admin/api/files/list';
import fs from 'fs/promises';
import path from 'path';

// Mock fs/promises
vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs/promises')>();
  return {
    ...actual,
    default: {
      ...actual,
      mkdir: vi.fn().mockImplementation(() => Promise.resolve()),
      writeFile: vi.fn().mockImplementation(() => Promise.resolve()),
      readdir: vi.fn().mockImplementation(() => Promise.resolve([])),
      stat: vi.fn().mockImplementation(() => Promise.resolve({ isFile: () => true, size: 100, birthtime: new Date(), mtime: new Date() })),
    },
    mkdir: vi.fn().mockImplementation(() => Promise.resolve()),
    writeFile: vi.fn().mockImplementation(() => Promise.resolve()),
    readdir: vi.fn().mockImplementation(() => Promise.resolve([])),
    stat: vi.fn().mockImplementation(() => Promise.resolve({ isFile: () => true, size: 100, birthtime: new Date(), mtime: new Date() })),
  };
});

describe('File Security Path Traversal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const SAFE_ROOT = path.join(process.cwd(), 'public');

  describe('Upload API', () => {
    it('should prevent path traversal in directory parameter', async () => {
      const formData = new FormData();
      const file = new File(['test content'], 'test.png', { type: 'image/png' });
      formData.append('file', file);
      // Attempt to traverse up
      formData.append('directory', '../sensitive');

      const request = new Request('http://localhost/admin/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      // Call the handler
      const response = await POST({ request } as any);

      const mkdirCalls = vi.mocked(fs.mkdir).mock.calls;

      // If we fixed it, we expect 403 or 400
      if (response.status === 403 || response.status === 400) {
          expect(true).toBe(true);
      } else {
         // If 200 (or other), it means it proceeded or failed later. We must check mkdir calls.
         if (mkdirCalls.length > 0) {
            const calledPath = mkdirCalls[0][0] as string;
            const resolvedCallPath = path.resolve(calledPath);
            // If vulnerable, this assertion will fail
            // We expect it to NOT be outside
            expect(resolvedCallPath.startsWith(SAFE_ROOT)).toBe(true);
         }
      }
    });
  });

  describe('List API', () => {
    it('should prevent path traversal in directory parameter', async () => {
      const url = new URL('http://localhost/admin/api/files/list?directory=../sensitive');

      const response = await GET({ url } as any);

      // If fixed, expecting error status
      if (response.status !== 200) {
           expect(response.status).toBeGreaterThanOrEqual(400);
      } else {
          // If 200, check readdir calls
          const readdirCalls = vi.mocked(fs.readdir).mock.calls;
          if (readdirCalls.length > 0) {
              const calledPath = readdirCalls[0][0] as string;
              const resolvedCallPath = path.resolve(calledPath);

              // If vulnerable, this assertion will fail
              expect(resolvedCallPath.startsWith(SAFE_ROOT)).toBe(true);
          }
      }
    });
  });
});
