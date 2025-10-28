import type { SiteConfig, SiteTemplate } from '../../types/config';
import { buildApiUrl } from '../admin/api-client';

export class ConfigClient {
  async getSiteConfig(): Promise<SiteConfig> {
    const response = await fetch(buildApiUrl('api/config/site'));

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch site configuration');
    }

    return response.json();
  }

  async updateSiteConfig(config: SiteConfig): Promise<SiteConfig> {
    const response = await fetch(buildApiUrl('api/config/site'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update site configuration');
    }

    const result = await response.json();
    return result.config;
  }

  async patchSiteConfig(updates: Partial<SiteConfig>): Promise<SiteConfig> {
    const response = await fetch(buildApiUrl('api/config/site'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update site configuration');
    }

    const result = await response.json();
    return result.config;
  }

  async getSiteTemplates(): Promise<Record<string, SiteTemplate>> {
    const response = await fetch(buildApiUrl('api/config/templates'));

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch site templates');
    }

    const result = await response.json();
    return result.templates;
  }

  async applySiteTemplate(templateId: string): Promise<{ config: SiteConfig; template: SiteTemplate }> {
    const response = await fetch(buildApiUrl('api/config/templates'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ templateId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to apply site template');
    }

    const result = await response.json();
    return {
      config: result.config,
      template: result.template
    };
  }

  // Utility methods for common operations
  async toggleContentType(contentTypeId: string, enabled: boolean): Promise<SiteConfig> {
    const config = await this.getSiteConfig();
    const contentType = config.contentTypes.find(ct => ct.id === contentTypeId);

    if (!contentType) {
      throw new Error(`Content type '${contentTypeId}' not found`);
    }

    contentType.enabled = enabled;

    // Also update corresponding navigation item
    const navItem = config.navigation.find(nav => nav.id === contentTypeId);
    if (navItem) {
      navItem.enabled = enabled;
    }

    return this.updateSiteConfig(config);
  }

  async toggleNavigationItem(navId: string, enabled: boolean): Promise<SiteConfig> {
    const config = await this.getSiteConfig();
    const navItem = config.navigation.find(nav => nav.id === navId);

    if (!navItem) {
      throw new Error(`Navigation item '${navId}' not found`);
    }

    navItem.enabled = enabled;
    return this.updateSiteConfig(config);
  }

  async reorderNavigation(newOrder: string[]): Promise<SiteConfig> {
    const config = await this.getSiteConfig();

    // Update order based on new array
    newOrder.forEach((navId, index) => {
      const navItem = config.navigation.find(nav => nav.id === navId);
      if (navItem) {
        navItem.order = index;
      }
    });

    // Sort navigation by order
    config.navigation.sort((a, b) => a.order - b.order);

    return this.updateSiteConfig(config);
  }
}

// Export singleton instance
export const configClient = new ConfigClient();
