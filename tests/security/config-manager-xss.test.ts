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
    // This test should pass when SVG content is properly sanitized
    expect(writtenContent.customization.logo.svgContent).not.toContain('<script>');
    expect(writtenContent.customization.logo.svgContent).toContain('<rect');
  });

  it('should sanitize SVG event handlers such as onload to prevent XSS', async () => {
    const maliciousSvg = '<svg onload="alert(1)"><rect width="10" height="10" /></svg>';
    // We expect the onload handler to be removed or neutralized

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

    // Check if the onload handler was removed
    // Currently it may FAIL because we haven't implemented sanitization yet
    expect(writtenContent.customization.logo.svgContent).not.toMatch(/onload\s*=/i);
    expect(writtenContent.customization.logo.svgContent).toContain('<rect');
  });

  it('should sanitize javascript: URLs in SVG to prevent XSS', async () => {
    const maliciousSvg =
      '<svg><image href="javascript:alert(1)" width="10" height="10" /></svg>';
    // We expect the javascript: URL to be removed or neutralized

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

    // Check if the javascript: URL was removed
    // Currently it may FAIL because we haven't implemented sanitization yet
    expect(writtenContent.customization.logo.svgContent).not.toMatch(/javascript:/i);
    expect(writtenContent.customization.logo.svgContent).toContain('<image');
  });

  it('should sanitize potentially dangerous data: URLs in SVG to prevent XSS', async () => {
    const maliciousSvg =
      '<svg><image href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==" width="10" height="10" /></svg>';
    // We expect dangerous data: URLs to be removed or neutralized

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

    // Check if the data: URL was removed
    // Currently it may FAIL because we haven't implemented sanitization yet
    expect(writtenContent.customization.logo.svgContent).not.toMatch(/data:/i);
    expect(writtenContent.customization.logo.svgContent).toContain('<image');
  });
});
