import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../../pages/admin/api/files/list';
import fs from 'fs/promises';
import path from 'path';

vi.mock('fs/promises', () => ({
  default: {
    readdir: vi.fn(),
    stat: vi.fn(),
  }
}));

describe('Admin API - Files List Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should prevent path traversal attempts', async () => {
    // Setup
    const url = new URL('http://localhost/api/files/list?directory=../../etc');

    // Execute
    await GET({ url } as any);

    // Verify
    const readdirCalls = (fs.readdir as any).mock.calls;

    if (readdirCalls.length > 0) {
        const calledPath = readdirCalls[0][0];
        const publicDir = path.join(process.cwd(), 'public');

        // We expect the path to be inside the public directory
        // If the vulnerability exists, this expectation will fail
        expect(calledPath.startsWith(publicDir), `Path traversal detected! Accessed: ${calledPath}`).toBe(true);
    }

    // If readdir was not called, that's also considered secure (request was rejected)
  });
});
