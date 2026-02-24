import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import { configManager } from '../../src/lib/config/manager';
import { DEFAULT_SITE_CONFIG } from '../../src/lib/config/defaults';
import type { SiteConfig } from '../../src/types/config';

// Mock fs/promises
vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs/promises')>();
  const mockedFs = {
    ...actual,
    writeFile: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue('{}'),
    access: vi.fn().mockResolvedValue(undefined),
  };
  return {
    ...mockedFs,
    default: mockedFs,
  };
});

describe('ConfigManager Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize SVG logo content to prevent XSS', async () => {
    const maliciousSvg = '<svg><script>alert("XSS")</script><rect width="10" height="10" /></svg>';
    // We expect the script tag to be removed

    const maliciousConfig: SiteConfig = {
      ...DEFAULT_SITE_CONFIG,
      customization: {
        ...DEFAULT_SITE_CONFIG.customization,
        logo: {
          type: 'svg',
          svgContent: maliciousSvg,
          width: 'w-8 h-8'
        }
      }
    };

    await configManager.saveConfig(maliciousConfig);

    expect(fs.writeFile).toHaveBeenCalled();
    const callArgs = vi.mocked(fs.writeFile).mock.calls[0];
    const writtenContent = JSON.parse(callArgs[1] as string);

    // Check if the script tag was removed
    // Currently it should FAIL because we haven't implemented sanitization yet
    expect(writtenContent.customization.logo.svgContent).not.toContain('<script>');
    expect(writtenContent.customization.logo.svgContent).toContain('<rect');
  });
});
