import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { configClient } from '../../lib/config/client';
import type { SiteConfig, SiteTemplate, HeroConfig, HeroAction, HeroFeature } from '../../types/config';
import { logger } from '../../lib/utils/logger';

interface SiteConfigurationProps {}

export const SiteConfiguration: React.FC<SiteConfigurationProps> = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [templates, setTemplates] = useState<Record<string, SiteTemplate> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    try {
      setLoading(true);
      const [configData, templateData] = await Promise.all([
        configClient.getSiteConfig(),
        configClient.getSiteTemplates()
      ]);
      
      logger.log('Loaded template data:', templateData);
      logger.log('Template entries:', Object.entries(templateData));
      
      setConfig(configData);
      setTemplates(templateData);
    } catch (err) {
      setError('Failed to load site configuration');
      logger.error('Config loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (updatedConfig: Partial<SiteConfig>) => {
    try {
      setSaving(true);
      // Use PATCH endpoint for partial updates instead of POST which requires full config
      const result = await configClient.patchSiteConfig(updatedConfig);
      if (result) {
        setConfig({ ...config!, ...updatedConfig });
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (err) {
      logger.error('Save error:', err);
      alert('Failed to save configuration: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const applyTemplate = async (templateId: string) => {
    try {
      setSaving(true);
      await configClient.applySiteTemplate(templateId);
      await loadConfigData(); // Reload to get updated config
    } catch (err) {
      logger.error('Template apply error:', err);
      alert('Failed to apply template: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const toggleContentType = async (contentTypeId: string) => {
    if (!config) return;
    
    const updatedContentTypes = config.contentTypes.map(ct => 
      ct.id === contentTypeId ? { ...ct, enabled: !ct.enabled } : ct
    );
    
    await saveConfig({ contentTypes: updatedContentTypes });
  };

  const updateNavigation = async (navigation: SiteConfig['navigation']) => {
    await saveConfig({ navigation });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading site configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Configuration</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadConfigData}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!config || !templates) {
    return <div className="p-6">No configuration data available</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Site Configuration</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your site's content types, navigation, and appearance
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'general', label: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            { id: 'hero', label: 'Hero', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'logo', label: 'Logo', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'social', label: 'Social', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { id: 'seo', label: 'Global SEO', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { id: 'page-seo', label: 'Page SEO', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'footer', label: 'Footer', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
            { id: 'content-types', label: 'Content Types', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'navigation', label: 'Navigation', icon: 'M4 6h16M4 12h16M4 18h16' },
            { id: 'templates', label: 'Templates', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button flex items-center ${activeTab === tab.id ? 'active' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === 'overview' && (
          <OverviewTab config={config} />
        )}

        {activeTab === 'general' && (
          <GeneralTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'hero' && (
          <HeroTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'logo' && (
          <LogoTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'social' && (
          <SocialTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'seo' && (
          <SEOTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'page-seo' && (
          <PageSEOTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'footer' && (
          <FooterTab config={config} onSave={saveConfig} saving={saving} />
        )}

        {activeTab === 'content-types' && (
          <ContentTypesTab
            config={config}
            onToggleContentType={toggleContentType}
            saving={saving}
          />
        )}

        {activeTab === 'navigation' && (
          <NavigationTab
            config={config}
            onUpdateNavigation={updateNavigation}
            saving={saving}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab
            templates={templates}
            onApplyTemplate={applyTemplate}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ config: SiteConfig }> = ({ config }) => {
  // Add defensive checks for config structure - fix navigation reference
  const siteTitle = config?.customization?.siteName || 'Untitled Site';
  const siteDescription = config?.customization?.description || 'No description available';
  const contentTypesCount = config?.contentTypes ? config.contentTypes.filter(ct => ct?.enabled).length : 0;
  const navigationItemsCount = config?.navigation?.length || 0;
  const siteMode = config?.siteMode || 'full';

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Name
            </label>
            <p className="text-gray-900 dark:text-white font-medium">{siteTitle}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{siteDescription}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Mode
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
              {siteMode}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content Types
            </label>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contentTypesCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">enabled</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Navigation Items
            </label>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {navigationItemsCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">items</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Modified
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {config?.lastModified ? new Date(config.lastModified).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Configuration Status
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Content Type Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {config?.contentTypes?.map((contentType) => (
            <div key={contentType.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">
                  {contentType.icon === 'document-text' ? '📄' : 
                   contentType.icon === 'briefcase' ? '💼' :
                   contentType.icon === 'user' ? '👤' :
                   contentType.icon === 'book-open' ? '📖' :
                   contentType.icon === 'mail' ? '✉️' : '📁'}
                </span>
                <h5 className="font-medium text-gray-900 dark:text-white text-sm">{contentType.name}</h5>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{contentType.route}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                contentType.enabled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {contentType.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

// Content Types Tab Component
const ContentTypesTab: React.FC<{
  config: SiteConfig;
  onToggleContentType: (id: string) => void;
  saving: boolean;
}> = ({ config, onToggleContentType, saving }) => {
  // Add defensive check for contentTypes
  const contentTypes = config?.contentTypes || [];

  // Get content type descriptions from defaults
  const getContentTypeDescription = (id: string) => {
    const descriptions: Record<string, string> = {
      blog: 'Articles, posts, and written content with publication dates, tags, and featured images',
      projects: 'Portfolio items showcasing your work with technologies, links, and project details',
      resume: 'Professional resume and career information including experience, education, and skills',
      docs: 'Documentation and guides organized by groups with ordering and table of contents',
      contact: 'Contact form and information for visitors to reach out to you'
    };
    return descriptions[id] || 'Content type for managing structured content';
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Types</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Configure content types to control what appears in your site navigation and content management. Each content type has its own schema, routing, and display settings.
      </p>

      <div className="space-y-6">
        {contentTypes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No content types available</p>
          </div>
        ) : (
          contentTypes.map((contentType) => (
            <div key={contentType?.id || 'unknown'} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Header with toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  {contentType?.icon && (
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {contentType.icon === 'document-text' ? '📄' : 
                         contentType.icon === 'briefcase' ? '💼' :
                         contentType.icon === 'user' ? '👤' :
                         contentType.icon === 'book-open' ? '📖' :
                         contentType.icon === 'mail' ? '✉️' : '📁'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{contentType?.name || 'Unnamed Content Type'}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order: {contentType?.order || 0}</p>
                  </div>
                </div>
                <button
                  onClick={() => contentType?.id && onToggleContentType(contentType.id)}
                  disabled={saving || !contentType?.id}
                  className={`toggle-switch ${contentType?.enabled ? 'active' : ''} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      contentType?.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Content details */}
              <div className="p-4 space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getContentTypeDescription(contentType?.id || '')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Route Path</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {contentType?.route || '/content'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</h5>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contentType?.enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {contentType?.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Settings */}
                {contentType?.settings && Object.keys(contentType.settings).length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Configuration</h5>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(contentType.settings).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Navigation Tab Component
const NavigationTab: React.FC<{
  config: SiteConfig;
  onUpdateNavigation: (navigation: SiteConfig['navigation']) => void;
  saving: boolean;
}> = ({ config, onUpdateNavigation, saving }) => {
  // Add defensive check for navigation structure - config.navigation is an array, not an object with items
  const initialNavigation = config?.navigation || [];
  const [navigation, setNavigation] = useState(initialNavigation);

  const handleSave = () => {
    onUpdateNavigation(navigation);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...navigation];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    
    // Update order values
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setNavigation(reorderedItems);
  };

  const toggleItemEnabled = (index: number) => {
    const updatedItems = [...navigation];
    updatedItems[index] = { ...updatedItems[index], enabled: !updatedItems[index].enabled };
    setNavigation(updatedItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...navigation];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNavigation(updatedItems);
  };

  const addNewItem = () => {
    const newItem = {
      id: `nav-${Date.now()}`,
      label: 'New Item',
      href: '/new-page',
      enabled: true,
      order: navigation.length,
      external: false
    };
    setNavigation([...navigation, newItem]);
  };

  const removeItem = (index: number) => {
    const updatedItems = navigation.filter((_, i) => i !== index);
    // Reorder remaining items
    const reorderedItems = updatedItems.map((item, i) => ({
      ...item,
      order: i
    }));
    setNavigation(reorderedItems);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Navigation</h3>
        <div className="flex space-x-2">
          <button
            onClick={addNewItem}
            disabled={saving}
            className="btn-success btn-sm"
          >
            Add Item
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Configure your site's main navigation menu. Drag items to reorder, toggle visibility, and customize links.
      </p>

      <div className="space-y-4">
        {navigation.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No navigation items configured</p>
            <button
              onClick={addNewItem}
              className="mt-2 btn-primary"
            >
              Add First Item
            </button>
          </div>
        ) : (
          navigation.map((item, index) => (
            <div key={item?.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Header with controls */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  {/* Drag handle */}
                  <div className="flex flex-col space-y-1 cursor-move">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  
                  {/* Icon */}
                  {item?.icon && (
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">
                        {item.icon === 'home' ? '🏠' : 
                         item.icon === 'document-text' ? '📄' : 
                         item.icon === 'briefcase' ? '💼' :
                         item.icon === 'user' ? '👤' :
                         item.icon === 'book-open' ? '📖' :
                         item.icon === 'mail' ? '✉️' : '🔗'}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{item?.label || 'Unnamed Item'}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order: {item?.order || index}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Move buttons */}
                  <button
                    onClick={() => moveItem(index, Math.max(0, index - 1))}
                    disabled={index === 0 || saving}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(index, Math.min(navigation.length - 1, index + 1))}
                    disabled={index === navigation.length - 1 || saving}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                  
                  {/* Visibility toggle */}
                  <button
                    onClick={() => toggleItemEnabled(index)}
                    disabled={saving}
                    className={`toggle-switch toggle-switch-sm ${item?.enabled ? 'active' : ''} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={item?.enabled ? 'Hide from navigation' : 'Show in navigation'}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        item?.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(index)}
                    disabled={saving}
                    className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content form */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={item?.label || ''}
                      onChange={(e) => updateItem(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Navigation label"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      URL/Path
                    </label>
                    <input
                      type="text"
                      value={item?.href || ''}
                      onChange={(e) => updateItem(index, 'href', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="/page-url"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item?.external || false}
                      onChange={(e) => updateItem(index, 'external', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">External link</span>
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item?.enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item?.enabled ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Templates Tab Component
const TemplatesTab: React.FC<{
  templates: Record<string, SiteTemplate>;
  onApplyTemplate: (templateId: string) => void;
  saving: boolean;
}> = ({ templates, onApplyTemplate, saving }) => {
  const templateEntries = templates ? Object.entries(templates) : [];

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Templates</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Apply pre-configured templates to quickly set up your site with different content types and navigation structures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateEntries.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No templates available</p>
          </div>
        ) : (
          templateEntries.map(([id, template]) => {
            // Filter content types to only show enabled ones
            const enabledContentTypes = template?.contentTypes?.filter(ct => ct?.enabled) || [];
            
            return (
              <div key={id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{template?.name || 'Unnamed Template'}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template?.description || 'No description available'}</p>
                
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Content Types:</h5>
                  <div className="flex flex-wrap gap-1">
                    {enabledContentTypes.length > 0 ? (
                      enabledContentTypes.map((ct) => (
                        <span key={ct.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                          {ct.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">No enabled content types</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onApplyTemplate(id)}
                  disabled={saving}
                  className="w-full btn-primary btn-sm"
                >
                  {saving ? 'Applying...' : 'Apply Template'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Hero Tab Component
const HeroTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const [hero, setHero] = useState<HeroConfig>(config.customization.hero || {
    title: { text: 'Build Fast,', highlightedText: 'Beautiful', suffixText: 'Websites' },
    subtitle: 'Transform your Markdown content into stunning, performant websites with Antler.',
    badge: { text: 'Modern Static Site Generation', icon: 'Zap' },
    actions: {
      primary: { text: 'Get Started', link: '/docs/installation', icon: 'ArrowRight' },
      secondary: { text: 'View Projects', link: '/projects', icon: null }
    },
    features: [
      { title: 'Developer First', description: 'Built with modern tools and best practices', icon: 'Code' },
      { title: 'Lightning Fast', description: 'Optimized for performance and SEO', icon: 'Zap' },
      { title: 'Deploy Anywhere', description: 'Static files work on any hosting platform', icon: 'Globe' }
    ]
  });

  const handleSave = async () => {
    await onSave({
      customization: {
        ...config.customization,
        hero
      }
    });
  };

  const updateHero = (field: string, value: any) => {
    // Helper to handle nested updates
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'title') {
        setHero({ ...hero, title: { ...hero.title, [child]: value } });
      } else if (parent === 'badge') {
        setHero({ ...hero, badge: { ...hero.badge, [child]: value } });
      } else if (parent === 'actions') {
        // e.g. actions.primary.text
        const [parent, actionType, actionField] = field.split('.');
        setHero({
          ...hero,
          actions: {
            ...hero.actions,
            [actionType as 'primary' | 'secondary']: {
              ...hero.actions[actionType as 'primary' | 'secondary'],
              [actionField]: value
            }
          }
        });
      }
    } else {
      setHero({ ...hero, [field]: value });
    }
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...hero.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setHero({ ...hero, features: newFeatures });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Hero Section Configuration</h3>

      <div className="space-y-8 max-w-4xl">
        {/* Title & Subtitle */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Main Heading
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Text
              </label>
              <input
                type="text"
                value={hero.title.text}
                onChange={(e) => updateHero('title.text', e.target.value)}
                className="form-input w-full"
                placeholder="Build Fast,"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Highlighted (Gradient)
              </label>
              <input
                type="text"
                value={hero.title.highlightedText}
                onChange={(e) => updateHero('title.highlightedText', e.target.value)}
                className="form-input w-full"
                placeholder="Beautiful"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Text (Optional)
              </label>
              <input
                type="text"
                value={hero.title.suffixText || ''}
                onChange={(e) => updateHero('title.suffixText', e.target.value)}
                className="form-input w-full"
                placeholder="Websites"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtitle
            </label>
            <textarea
              value={hero.subtitle}
              onChange={(e) => updateHero('subtitle', e.target.value)}
              rows={2}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Badge
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Badge Text
              </label>
              <input
                type="text"
                value={hero.badge.text}
                onChange={(e) => updateHero('badge.text', e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Badge Icon (Lucide Icon Name)
              </label>
              <input
                type="text"
                value={hero.badge.icon}
                onChange={(e) => updateHero('badge.icon', e.target.value)}
                className="form-input w-full"
                placeholder="Zap"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Actions (Buttons)
          </h4>

          {/* Primary Action */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Primary Button</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text</label>
                <input
                  type="text"
                  value={hero.actions.primary.text}
                  onChange={(e) => updateHero('actions.primary.text', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Link</label>
                <input
                  type="text"
                  value={hero.actions.primary.link}
                  onChange={(e) => updateHero('actions.primary.link', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Icon</label>
                <input
                  type="text"
                  value={hero.actions.primary.icon || ''}
                  onChange={(e) => updateHero('actions.primary.icon', e.target.value)}
                  className="form-input w-full text-sm"
                  placeholder="ArrowRight"
                />
              </div>
            </div>
          </div>

          {/* Secondary Action */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Secondary Button</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text</label>
                <input
                  type="text"
                  value={hero.actions.secondary.text}
                  onChange={(e) => updateHero('actions.secondary.text', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Link</label>
                <input
                  type="text"
                  value={hero.actions.secondary.link}
                  onChange={(e) => updateHero('actions.secondary.link', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Icon</label>
                <input
                  type="text"
                  value={hero.actions.secondary.icon || ''}
                  onChange={(e) => updateHero('actions.secondary.icon', e.target.value || null)}
                  className="form-input w-full text-sm"
                  placeholder="(Optional)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Features (3 Columns)
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {hero.features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Feature {index + 1}</h5>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="form-input w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Icon</label>
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      className="form-input w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      className="form-input w-full text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Hero Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

// General Settings Tab Component
const GeneralTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const [siteName, setSiteName] = useState(config.customization.siteName);
  const [description, setDescription] = useState(config.customization.description);
  const [tagline, setTagline] = useState(config.customization.tagline || '');
  const [authorName, setAuthorName] = useState(config.customization.author.name);
  const [authorEmail, setAuthorEmail] = useState(config.customization.author.email || '');
  const [authorBio, setAuthorBio] = useState(config.customization.author.bio || '');

  const handleSave = async () => {
    await onSave({
      customization: {
        ...config.customization,
        siteName,
        description,
        tagline,
        author: {
          ...config.customization.author,
          name: authorName,
          email: authorEmail,
          bio: authorBio
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">General Settings</h3>

      <div className="space-y-6 max-w-2xl">
        {/* Site Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Site Information</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="form-input w-full"
                placeholder="My Awesome Site"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The name of your site (displayed in header, footer, and meta tags)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="form-input w-full"
                placeholder="A modern website built with Antler"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Brief description of your site (used in meta tags and footer)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="form-input w-full"
                placeholder="Transform your ideas into reality"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A catchy tagline (displayed in footer)
              </p>
            </div>
          </div>
        </div>

        {/* Author Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Author Information</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="form-input w-full"
                placeholder="John Doe"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your name (used in meta tags)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="form-input w-full"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                rows={3}
                className="form-input w-full"
                placeholder="Software developer and content creator..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Logo Tab Component
const LogoTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const [logoType, setLogoType] = useState<'svg' | 'image' | 'text'>(config.customization.logo?.type || 'svg');
  const [svgContent, setSvgContent] = useState(config.customization.logo?.svgContent || '');
  const [imagePath, setImagePath] = useState(config.customization.logo?.imagePath || '');
  const [imageAlt, setImageAlt] = useState(config.customization.logo?.imageAlt || '');
  const [width, setWidth] = useState(config.customization.logo?.width || 'w-8 h-8');

  const handleSave = async () => {
    await onSave({
      customization: {
        ...config.customization,
        logo: {
          type: logoType,
          svgContent: logoType === 'svg' ? svgContent : undefined,
          imagePath: logoType === 'image' ? imagePath : undefined,
          imageAlt: logoType === 'image' ? imageAlt : undefined,
          width
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Logo Configuration</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Logo Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="svg"
                  checked={logoType === 'svg'}
                  onChange={(e) => setLogoType(e.target.value as 'svg')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  SVG Code (best for scalability)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="image"
                  checked={logoType === 'image'}
                  onChange={(e) => setLogoType(e.target.value as 'image')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Image File (PNG, JPG)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  checked={logoType === 'text'}
                  onChange={(e) => setLogoType(e.target.value as 'text')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Text Only (no icon)
                </span>
              </label>
            </div>
          </div>

          {logoType === 'svg' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SVG Code
              </label>
              <textarea
                value={svgContent}
                onChange={(e) => setSvgContent(e.target.value)}
                rows={8}
                className="form-input w-full font-mono text-sm"
                placeholder='<svg class="w-8 h-8" viewBox="0 0 24 24">...</svg>'
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Paste your complete SVG code here
              </p>
            </div>
          )}

          {logoType === 'image' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image Path
                </label>
                <input
                  type="text"
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  className="form-input w-full"
                  placeholder="/images/logo.png"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Path to your logo image file
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="form-input w-full"
                  placeholder="Company Logo"
                />
              </div>
            </>
          )}

          {logoType !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size (Tailwind Classes)
              </label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="form-input w-full"
                placeholder="w-8 h-8"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tailwind CSS classes for width and height
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Logo'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preview
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                {logoType === 'svg' && svgContent && (
                  // Sentinel: Sanitize SVG content to prevent XSS
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svgContent) }} />
                )}
                {logoType === 'image' && imagePath && (
                  <img src={imagePath} alt={imageAlt} className={width || 'w-8 h-8'} />
                )}
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {config.customization.siteName}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is how your logo will appear in the header and footer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Media Tab Component
const SocialTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const [github, setGithub] = useState(config.customization.social.github || '');
  const [twitter, setTwitter] = useState(config.customization.social.twitter || '');
  const [linkedin, setLinkedin] = useState(config.customization.social.linkedin || '');
  const [facebook, setFacebook] = useState(config.customization.social.facebook || '');
  const [instagram, setInstagram] = useState(config.customization.social.instagram || '');
  const [youtube, setYoutube] = useState(config.customization.social.youtube || '');

  const handleSave = async () => {
    await onSave({
      customization: {
        ...config.customization,
        social: {
          github: github || undefined,
          twitter: twitter || undefined,
          linkedin: linkedin || undefined,
          facebook: facebook || undefined,
          instagram: instagram || undefined,
          youtube: youtube || undefined,
          custom: config.customization.social.custom
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Social Media Links</h3>

      <div className="space-y-6 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your social media profile URLs. These will appear as icons in your site's footer.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </span>
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="form-input w-full"
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter / X
              </span>
            </label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="form-input w-full"
              placeholder="https://twitter.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </span>
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="form-input w-full"
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </span>
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="form-input w-full"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
                Instagram
              </span>
            </label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="form-input w-full"
              placeholder="https://instagram.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </span>
            </label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="form-input w-full"
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      </div>
    </div>
  );
};

// SEO Tab Component
const SEOTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const [defaultImage, setDefaultImage] = useState(config.customization.seo.defaultImage || '');
  const [twitterHandle, setTwitterHandle] = useState(config.customization.seo.twitterHandle || '');
  const [facebookAppId, setFacebookAppId] = useState(config.customization.seo.facebookAppId || '');
  const [googleSiteVerification, setGoogleSiteVerification] = useState(config.customization.seo.googleSiteVerification || '');
  const [keywords, setKeywords] = useState((config.customization.seo.keywords || []).join(', '));

  const handleSave = async () => {
    await onSave({
      customization: {
        ...config.customization,
        seo: {
          defaultImage: defaultImage || undefined,
          twitterHandle: twitterHandle || undefined,
          facebookAppId: facebookAppId || undefined,
          googleSiteVerification: googleSiteVerification || undefined,
          keywords: keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : undefined
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Global SEO Settings</h3>

      <div className="space-y-6 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure default meta tags and SEO settings to improve your site's visibility in search engines and social media.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default OG Image
            </label>
            <input
              type="text"
              value={defaultImage}
              onChange={(e) => setDefaultImage(e.target.value)}
              className="form-input w-full"
              placeholder="/images/og-default.png"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Default Open Graph image (1200x630px recommended)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Global Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="form-input w-full"
              placeholder="static site, blog, portfolio, astro"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comma-separated keywords for meta tags on all pages
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Twitter Handle
            </label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              className="form-input w-full"
              placeholder="@yourusername"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your Twitter handle (for Twitter Card meta tags)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facebook App ID
            </label>
            <input
              type="text"
              value={facebookAppId}
              onChange={(e) => setFacebookAppId(e.target.value)}
              className="form-input w-full"
              placeholder="123456789012345"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Facebook App ID for Facebook insights
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Site Verification
            </label>
            <input
              type="text"
              value={googleSiteVerification}
              onChange={(e) => setGoogleSiteVerification(e.target.value)}
              className="form-input w-full"
              placeholder="abc123def456ghi789"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Google Search Console verification code
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Global SEO Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Page SEO Tab Component
// Define or import pageOptions array
const pageOptions = ['blog', 'docs', 'projects', 'resume', 'contact'];

const PageSEOTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const pages = config.customization.pages || {};
  const allPageTypes = Object.keys(pages).length > 0 
    ? Object.keys(pages) 
    : ['blog', 'docs', 'projects', 'resume', 'contact']; // fallback to known types if config is empty
    
  const [selectedPage, setSelectedPage] = useState(allPageTypes[0]);
  const initialPageConfig = (config.customization.pages || {})[selectedPage] || {};
  
  const [title, setTitle] = useState(initialPageConfig.title || '');
  const [description, setDescription] = useState(initialPageConfig.description || '');
  const [image, setImage] = useState(initialPageConfig.image || '');
  const [keywords, setKeywords] = useState((initialPageConfig.keywords || []).join(', '));

  // Update form when selected page changes
  useEffect(() => {
    const pageConfig = (config.customization.pages || {})[selectedPage] || {};
    setTitle(pageConfig.title || '');
    setDescription(pageConfig.description || '');
    setImage(pageConfig.image || '');
    setKeywords((pageConfig.keywords || []).join(', '));
  }, [selectedPage, config.customization.pages]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear SEO settings for this page? This will revert to site-wide defaults upon saving.')) {
      setTitle('');
      setDescription('');
      setImage('');
      setKeywords('');
    }
  };

  const handleSave = async () => {
    const updatedPages = {
      ...(config.customization.pages || {}),
      [selectedPage]: {
        title: title || undefined,
        description: description || undefined,
        image: image || undefined,
        keywords: keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : undefined
      }
    };

    await onSave({
      customization: {
        ...config.customization,
        pages: updatedPages
      }
    });
  };

  const pageOptions = [
    { id: 'blog', label: 'Blog Index' },
    { id: 'docs', label: 'Documentation Index' },
    { id: 'projects', label: 'Projects Index' },
    { id: 'resume', label: 'Resume Page' },
    { id: 'contact', label: 'Contact Page' }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Page SEO Settings</h3>

      <div className="space-y-6 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure specific SEO settings for main index pages.
        </p>

        {/* Page Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Page
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="form-input w-full"
          >
            {pageOptions.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full"
              placeholder="e.g. Blog - My Site"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-input w-full"
              placeholder="Description for this specific page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OG Image
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="form-input w-full"
              placeholder="/images/blog-og.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="form-input w-full"
              placeholder="page, specific, keywords"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            * Empty fields will use site defaults
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleClear}
              disabled={saving}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : `Save ${pageOptions.find(p => p.id === selectedPage)?.label} SEO`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Tab Component
const FooterTab: React.FC<{
  config: SiteConfig;
  onSave: (updates: Partial<SiteConfig>) => Promise<void>;
  saving: boolean;
}> = ({ config, onSave, saving }) => {
  const [copyrightText, setCopyrightText] = useState(config.customization.footer.copyrightText);
  const [showBuiltWith, setShowBuiltWith] = useState(config.customization.footer.showBuiltWith);
  const [showSocialLinks, setShowSocialLinks] = useState(config.customization.footer.showSocialLinks);

  const handleSave = async () => {
    await onSave({
      customization: {
        ...config.customization,
        footer: {
          ...config.customization.footer,
          copyrightText,
          showBuiltWith,
          showSocialLinks
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Footer Configuration</h3>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Copyright Text
          </label>
          <input
            type="text"
            value={copyrightText}
            onChange={(e) => setCopyrightText(e.target.value)}
            className="form-input w-full"
            placeholder="© 2025 Your Site. All rights reserved."
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Displayed at the bottom of every page
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showBuiltWith}
              onChange={(e) => setShowBuiltWith(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Show "Built with..." attribution
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showSocialLinks}
              onChange={(e) => setShowSocialLinks(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Show social media links in footer
            </span>
          </label>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Footer sections (Quick Links, Resources) and legal links (Privacy, Terms) are configured in site.config.json. A visual editor for these will be added in a future update.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Footer Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteConfiguration;