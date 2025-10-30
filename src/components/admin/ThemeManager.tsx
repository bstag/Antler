import React, { useState, useEffect } from 'react';
import { getAllThemeMetadata, getThemeMetadata, type ThemeMetadata } from '../../lib/theme/theme-registry';
import {
  switchTheme,
  getCurrentTheme,
  getSiteDefaultTheme,
  hasUserPreference,
  clearUserPreference
} from '../../lib/theme/theme-loader';
import {
  getThemeConfig,
  updateSiteDefaultTheme
} from '../../lib/theme/theme-config-api';
import { logger } from '../../lib/utils/logger';

export const ThemeManager: React.FC = () => {
  const [themes, setThemes] = useState<ThemeMetadata[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string>('blue');
  const [siteDefault, setSiteDefault] = useState<string>('blue');
  const [hasUserPref, setHasUserPref] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  useEffect(() => {
    loadThemeData();
  }, []);

  const loadThemeData = async () => {
    try {
      setLoading(true);

      // Load all theme metadata
      const allThemes = getAllThemeMetadata();
      setThemes(allThemes);

      // Load current config
      const config = await getThemeConfig();
      setSiteDefault(config.siteDefault);
      setCurrentTheme(config.active);
      setHasUserPref(hasUserPreference());

    } catch (error) {
      logger.error('Error loading theme data:', error);
      showMessage('error', 'Failed to load theme configuration');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePreview = (themeId: string) => {
    setPreviewTheme(themeId);
    switchTheme(themeId, false); // Preview without saving
  };

  const handleApply = () => {
    if (previewTheme) {
      switchTheme(previewTheme, true); // Save preference
      setCurrentTheme(previewTheme);
      setHasUserPref(true);
      setPreviewTheme(null);
      showMessage('success', `Theme "${getThemeMetadata(previewTheme)?.name}" applied to your preferences`);
    }
  };

  const handleCancelPreview = () => {
    if (previewTheme) {
      // Revert to current theme
      switchTheme(currentTheme, false);
      setPreviewTheme(null);
    }
  };

  const handleResetToDefault = () => {
    clearUserPreference();
    const defaultTheme = getSiteDefaultTheme();
    switchTheme(defaultTheme, false);
    setCurrentTheme(defaultTheme);
    setHasUserPref(false);
    setPreviewTheme(null);
    showMessage('info', 'Reset to site default theme');
  };

  const handleSaveAsDefault = async () => {
    const themeToSave = previewTheme || currentTheme;

    setSaving(true);
    try {
      const success = await updateSiteDefaultTheme(themeToSave);

      if (success) {
        setSiteDefault(themeToSave);
        showMessage('success', `Site default theme updated to "${getThemeMetadata(themeToSave)?.name}". Rebuild required for static sites.`);
      } else {
        showMessage('info', 'Cannot update site default in static mode. Edit site.config.json and rebuild to change the default.');
      }
    } catch (error) {
      showMessage('error', 'Failed to update site default theme');
    } finally {
      setSaving(false);
    }
  };

  const getColorFamilyColor = (family: string): string => {
    const colors: Record<string, string> = {
      'blue': '#2563eb',
      'blue-purple': '#4f46e5',
      'purple': '#9333ea',
      'pink': '#db2777',
      'pink-red': '#e11d48',
      'red': '#dc2626',
      'orange': '#ea580c',
      'yellow-orange': '#d97706',
      'yellow': '#ca8a04',
      'yellow-green': '#65a30d',
      'green': '#16a34a',
      'blue-green': '#0d9488',
      'gray': '#475569',
    };
    return colors[family] || '#2563eb';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeTheme = previewTheme || currentTheme;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Theme Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a color theme for the site. Changes apply instantly with live preview.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-6 ${
          message.type === 'success' ? 'alert-success' :
          message.type === 'error' ? 'alert-error' :
          'alert-info'
        }`}>
          {message.text}
        </div>
      )}

      {/* Current Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Site Default</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {getThemeMetadata(siteDefault)?.name || siteDefault}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Preference</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {hasUserPref ? getThemeMetadata(currentTheme)?.name : 'None (using site default)'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Theme</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {getThemeMetadata(activeTheme)?.name}
              {previewTheme && <span className="text-sm text-blue-600 dark:text-blue-400 ml-2">(Preview)</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Actions */}
      {previewTheme && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Previewing: {getThemeMetadata(previewTheme)?.name}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Click "Apply Theme" to save this as your preference
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelPreview}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="btn-primary"
              >
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Themes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((theme) => {
            const isActive = theme.id === activeTheme;
            const isSiteDefault = theme.id === siteDefault;

            return (
              <button
                key={theme.id}
                onClick={() => handlePreview(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all text-left theme-card ${
                  isActive ? 'theme-card-active' : ''
                }`}
              >
                {/* Color Swatch */}
                <div
                  className="w-full h-16 rounded-md mb-3 shadow-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                />

                {/* Theme Name */}
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {theme.name}
                </h3>

                {/* Theme Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {theme.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {theme.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Active Badge */}
                {isActive && (
                  <div className="absolute top-2 right-2 badge badge-primary">
                    Active
                  </div>
                )}

                {/* Default Badge */}
                {isSiteDefault && !isActive && (
                  <div className="absolute top-2 right-2 badge badge-secondary">
                    Default
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleResetToDefault}
            disabled={!hasUserPref}
            className="btn-secondary"
          >
            Reset to Site Default
          </button>

          <button
            onClick={handleSaveAsDefault}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save as Site Default'}
          </button>

          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Site default requires rebuild for static sites
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How Theme Settings Work</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Preview:</strong> Click any theme to see it instantly (not saved)</li>
          <li>• <strong>Apply Theme:</strong> Save the previewed theme as your personal preference</li>
          <li>• <strong>Reset to Site Default:</strong> Clear your preference and use the site default</li>
          <li>• <strong>Save as Site Default:</strong> Set the theme for all users (admin only, requires rebuild)</li>
          <li>• <strong>Dark Mode:</strong> Works independently of color themes (toggle in header)</li>
        </ul>
      </div>
    </div>
  );
};
