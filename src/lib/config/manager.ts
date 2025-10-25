import fs from 'fs/promises';
import path from 'path';
import type { SiteConfig, SiteTemplate, ConfigValidationResult } from '../../types/config';
import { DEFAULT_SITE_CONFIG, SITE_TEMPLATES } from './defaults';
import { validateSiteConfig } from './validation';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'site.config.json');
const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'lib', 'config', 'templates');

export class ConfigManager {
  private static instance: ConfigManager;
  private cachedConfig: SiteConfig | null = null;
  private configWatchers: Set<(config: SiteConfig) => void> = new Set();

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load site configuration from file or return default config
   */
  async loadConfig(): Promise<SiteConfig> {
    try {
      const configExists = await this.configExists();
      
      if (!configExists) {
        // Create default config file if it doesn't exist
        await this.saveConfig(DEFAULT_SITE_CONFIG);
        this.cachedConfig = DEFAULT_SITE_CONFIG;
        return DEFAULT_SITE_CONFIG;
      }

      const configData = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
      const config = JSON.parse(configData) as SiteConfig;
      
      // Validate the loaded config
      const validation = validateSiteConfig(config);
      if (!validation.valid) {
        console.warn('Invalid configuration detected, using default config:', validation.errors);
        this.cachedConfig = DEFAULT_SITE_CONFIG;
        return DEFAULT_SITE_CONFIG;
      }

      this.cachedConfig = config;
      return config;
    } catch (error) {
      console.error('Error loading site configuration:', error);
      this.cachedConfig = DEFAULT_SITE_CONFIG;
      return DEFAULT_SITE_CONFIG;
    }
  }

  /**
   * Save site configuration to file
   */
  async saveConfig(config: SiteConfig): Promise<ConfigValidationResult> {
    const validation = validateSiteConfig(config);
    
    if (!validation.valid) {
      return validation;
    }

    try {
      // Update lastModified timestamp
      const configToSave = {
        ...config,
        lastModified: new Date().toISOString()
      };

      await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(configToSave, null, 2), 'utf-8');
      this.cachedConfig = configToSave;
      
      // Notify watchers
      this.configWatchers.forEach(callback => callback(configToSave));
      
      return { valid: true, errors: [] };
    } catch (error) {
      console.error('Error saving site configuration:', error);
      return {
        valid: false,
        errors: [{
          field: 'root',
          message: 'Failed to save configuration file',
          code: 'SAVE_ERROR'
        }]
      };
    }
  }

  /**
   * Get cached configuration or load from file
   */
  async getConfig(): Promise<SiteConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }
    return await this.loadConfig();
  }

  /**
   * Update specific parts of the configuration
   */
  async updateConfig(updates: Partial<SiteConfig>): Promise<ConfigValidationResult> {
    const currentConfig = await this.getConfig();
    const newConfig = { 
      ...currentConfig, 
      ...updates,
      lastModified: new Date().toISOString()
    };
    return await this.saveConfig(newConfig);
  }

  /**
   * Apply a site template
   */
  async applyTemplate(templateId: string): Promise<ConfigValidationResult> {
    const template = SITE_TEMPLATES[templateId];
    if (!template) {
      return {
        valid: false,
        errors: [{
          field: 'template',
          message: `Template '${templateId}' not found`,
          code: 'TEMPLATE_NOT_FOUND'
        }]
      };
    }

    const currentConfig = await this.getConfig();
    const newConfig: SiteConfig = {
      ...currentConfig,
      siteMode: template.siteMode,
      contentTypes: currentConfig.contentTypes.map(ct => {
        const templateCt = template.contentTypes.find(tct => tct.id === ct.id);
        return templateCt ? { ...ct, ...templateCt } : ct;
      }),
      navigation: currentConfig.navigation.map(nav => {
        const templateNav = template.navigation.find(tnav => tnav.id === nav.id);
        return templateNav ? { ...nav, ...templateNav } : nav;
      }),
      customLinks: template.customLinks || currentConfig.customLinks
    };

    return await this.saveConfig(newConfig);
  }

  /**
   * Get available site templates
   */
  getTemplates(): Record<string, SiteTemplate> {
    return SITE_TEMPLATES;
  }

  /**
   * Check if configuration file exists
   */
  async configExists(): Promise<boolean> {
    try {
      await fs.access(CONFIG_FILE_PATH);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reset configuration to default
   */
  async resetConfig(): Promise<ConfigValidationResult> {
    return await this.saveConfig(DEFAULT_SITE_CONFIG);
  }

  /**
   * Watch for configuration changes
   */
  onConfigChange(callback: (config: SiteConfig) => void): () => void {
    this.configWatchers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.configWatchers.delete(callback);
    };
  }

  /**
   * Get enabled content types
   */
  async getEnabledContentTypes(): Promise<string[]> {
    const config = await this.getConfig();
    return config.contentTypes
      .filter(ct => ct.enabled)
      .sort((a, b) => a.order - b.order)
      .map(ct => ct.id);
  }

  /**
   * Get enabled navigation items
   */
  async getEnabledNavigation(): Promise<SiteConfig['navigation']> {
    const config = await this.getConfig();
    return config.navigation
      .filter(nav => nav.enabled)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Check if a content type is enabled
   */
  async isContentTypeEnabled(contentTypeId: string): Promise<boolean> {
    const enabledTypes = await this.getEnabledContentTypes();
    return enabledTypes.includes(contentTypeId);
  }

  /**
   * Get content type configuration
   */
  async getContentTypeConfig(contentTypeId: string): Promise<SiteConfig['contentTypes'][0] | null> {
    const config = await this.getConfig();
    return config.contentTypes.find(ct => ct.id === contentTypeId) || null;
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();