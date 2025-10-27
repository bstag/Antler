/**
 * Theme Loader Utility
 * Handles loading and switching between color themes
 */

import { isValidTheme } from './theme-registry';

const THEME_STORAGE_KEY = 'antler-selected-theme';
const DARK_MODE_KEY = 'theme'; // Existing dark mode key

/**
 * Get the base URL from meta tag
 */
function getBaseUrl(): string {
  const meta = document.querySelector('meta[name="base-url"]');
  return meta?.getAttribute('content') || '/';
}

/**
 * Load a theme by swapping the CSS file
 */
export function loadTheme(themeName: string): void {
  if (!isValidTheme(themeName)) {
    console.warn(`Invalid theme: ${themeName}, falling back to blue`);
    themeName = 'blue';
  }

  const baseUrl = getBaseUrl();
  const themeLink = document.getElementById('theme-stylesheet') as HTMLLinkElement;
  if (themeLink) {
    themeLink.href = `${baseUrl}/styles/themes/theme-${themeName}.css`;
  } else {
    console.error('Theme stylesheet link not found in DOM');
  }
}

/**
 * Get the currently active theme
 */
export function getCurrentTheme(): string {
  // Check localStorage first (user preference)
  const userPreference = localStorage.getItem(THEME_STORAGE_KEY);
  if (userPreference && isValidTheme(userPreference)) {
    return userPreference;
  }

  // Fall back to site default
  return getSiteDefaultTheme();
}

/**
 * Get the site default theme from config
 * This is a client-side helper - actual value comes from site.config.json
 */
export function getSiteDefaultTheme(): string {
  // This will be populated by the BaseLayout from site.config.json
  const meta = document.querySelector('meta[name="theme-default"]');
  if (meta) {
    const content = meta.getAttribute('content');
    if (content && isValidTheme(content)) {
      return content;
    }
  }

  return 'blue'; // Ultimate fallback
}

/**
 * Save user's theme preference to localStorage
 */
export function saveUserPreference(themeName: string): void {
  if (!isValidTheme(themeName)) {
    console.warn(`Cannot save invalid theme: ${themeName}`);
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, themeName);
}

/**
 * Clear user's theme preference (revert to site default)
 */
export function clearUserPreference(): void {
  localStorage.removeItem(THEME_STORAGE_KEY);
}

/**
 * Check if user has a saved preference
 */
export function hasUserPreference(): boolean {
  const pref = localStorage.getItem(THEME_STORAGE_KEY);
  return pref !== null && isValidTheme(pref);
}

/**
 * Initialize theme on page load
 * Call this early in the page lifecycle to prevent flash
 */
export function initializeTheme(): string {
  const themeName = getCurrentTheme();
  loadTheme(themeName);
  return themeName;
}

/**
 * Switch to a new theme and optionally save preference
 */
export function switchTheme(themeName: string, savePreference: boolean = true): void {
  if (!isValidTheme(themeName)) {
    console.warn(`Cannot switch to invalid theme: ${themeName}`);
    return;
  }

  loadTheme(themeName);

  if (savePreference) {
    saveUserPreference(themeName);
  }

  // Dispatch custom event for other components to react
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: themeName }
  }));
}

/**
 * Get dark mode state (existing functionality)
 */
export function isDarkMode(): boolean {
  const savedMode = localStorage.getItem(DARK_MODE_KEY);
  if (savedMode === 'dark') return true;
  if (savedMode === 'light') return false;

  // Check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Toggle dark mode (existing functionality)
 */
export function toggleDarkMode(): void {
  const isDark = isDarkMode();
  const newMode = isDark ? 'light' : 'dark';

  localStorage.setItem(DARK_MODE_KEY, newMode);

  if (newMode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Dispatch event
  window.dispatchEvent(new CustomEvent('darkmode-changed', {
    detail: { darkMode: newMode === 'dark' }
  }));
}

/**
 * Initialize dark mode on page load
 */
export function initializeDarkMode(): void {
  if (isDarkMode()) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
