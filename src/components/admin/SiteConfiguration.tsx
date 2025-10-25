import React, { useState, useEffect } from 'react';
import { configClient } from '../../lib/config/client';
import type { SiteConfig, SiteTemplate } from '../../types/config';

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
      
      console.log('Loaded template data:', templateData);
      console.log('Template entries:', Object.entries(templateData));
      
      setConfig(configData);
      setTemplates(templateData);
    } catch (err) {
      setError('Failed to load site configuration');
      console.error('Config loading error:', err);
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
      console.error('Save error:', err);
      alert('Failed to save configuration: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const applyTemplate = async (templateId: string) => {
    try {
      setSaving(true);
      const result = await configClient.applyTemplate(templateId);
      if (result.success) {
        await loadConfigData(); // Reload to get updated config
      } else {
        throw new Error(result.error || 'Failed to apply template');
      }
    } catch (err) {
      console.error('Template apply error:', err);
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'content-types', label: 'Content Types', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'navigation', label: 'Navigation', icon: 'M4 6h16M4 12h16M4 18h16' },
            { id: 'templates', label: 'Templates', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-4a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    contentType?.enabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Add Item
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      item?.enabled
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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

export default SiteConfiguration;