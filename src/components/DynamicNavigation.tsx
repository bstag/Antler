import React, { useState, useEffect } from 'react';
import type { NavigationItem, SiteConfig } from '../types/config';
import { configClient } from '../lib/config/client';
import { withBase, isActivePath } from '../lib/utils/base-url';
import { logger } from '../lib/utils/logger';

interface DynamicNavigationProps {
  currentPath?: string;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ currentPath = '/' }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const siteConfig = await configClient.getSiteConfig();
        setConfig(siteConfig);
        setError(null);
      } catch (err) {
        logger.error('Failed to load site configuration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const getEnabledNavigation = (): NavigationItem[] => {
    if (!config) return [];
    
    return config.navigation
      .filter(nav => nav.enabled)
      .sort((a, b) => a.order - b.order);
  };

  const isActiveLink = (href: string): boolean => {
    return isActivePath(href, currentPath);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-8">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    logger.warn('Navigation error:', error);
    // Fallback to default navigation
    const fallbackNav = [
      { id: 'home', label: 'Home', href: '/', enabled: true, order: 0 },
      { id: 'blog', label: 'Blog', href: '/blog', enabled: true, order: 1 },
      { id: 'projects', label: 'Projects', href: '/projects', enabled: true, order: 2 },
      { id: 'resume', label: 'Resume', href: '/resume', enabled: true, order: 3 },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 4 }
    ];
    
    return (
      <>
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-8">
            {fallbackNav.map((item) => (
              <a
                key={item.id}
                href={withBase(item.href)}
                className={`nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          aria-expanded={mobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {!mobileMenuOpen ? (
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {fallbackNav.map((item) => (
                <a
                  key={item.id}
                  href={withBase(item.href)}
                  onClick={closeMobileMenu}
                  className={`mobile-nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  const enabledNavigation = getEnabledNavigation();

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-8">
          {enabledNavigation.map((item) => (
            <a
              key={item.id}
              href={withBase(item.href)}
              className={`nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
              aria-current={isActiveLink(item.href) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        aria-expanded={mobileMenuOpen}
      >
        <span className="sr-only">Open main menu</span>
        {!mobileMenuOpen ? (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {enabledNavigation.map((item) => (
              <a
                key={item.id}
                href={withBase(item.href)}
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicNavigation;