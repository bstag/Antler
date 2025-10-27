import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { SchemaDefinition } from '../../lib/admin/types';
import ThemeToggle from '../ThemeToggle';

interface ResumeLayoutProps {
  children: React.ReactNode;
  schemas: Record<string, SchemaDefinition>;
}

const resumeCollections = [
  'resumePersonal',
  'resumeExperience', 
  'resumeEducation',
  'resumeSkills',
  'resumeCertifications',
  'resumeLanguages',
  'resumeProjects'
];

const getCollectionDisplayName = (collection: string): string => {
  const names: Record<string, string> = {
    resumePersonal: 'Personal Info',
    resumeExperience: 'Experience',
    resumeEducation: 'Education',
    resumeSkills: 'Skills',
    resumeCertifications: 'Certifications',
    resumeLanguages: 'Languages',
    resumeProjects: 'Projects'
  };
  return names[collection] || collection;
};

const getCollectionIcon = (collection: string): string => {
  const icons: Record<string, string> = {
    resumePersonal: '👤',
    resumeExperience: '💼',
    resumeEducation: '🎓',
    resumeSkills: '⚡',
    resumeCertifications: '🏆',
    resumeLanguages: '🌍',
    resumeProjects: '🚀'
  };
  return icons[collection] || '📄';
};

export const ResumeLayout: React.FC<ResumeLayoutProps> = ({ children, schemas }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Antler</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                  </div>
                )}
              </Link>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8">
            <div className="px-4">
              {sidebarOpen && (
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                  Navigation
                </h2>
              )}

              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg mr-3">🏠</span>
                    {sidebarOpen && 'Main Panel'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute('/resume')
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg mr-3">📄</span>
                    {sidebarOpen && 'Resume Panel'}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-8 px-4">
              {sidebarOpen && (
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                  Resume Sections
                </h2>
              )}

              <ul className="space-y-1">
                {resumeCollections.map((collection) => {
                  const schema = schemas[collection];
                  if (!schema) return null;

                  return (
                    <li key={collection}>
                      <Link
                        to={`/resume/content/${collection}`}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActiveRoute(`/resume/content/${collection}`)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-lg mr-3">{getCollectionIcon(collection)}</span>
                        {sidebarOpen && getCollectionDisplayName(collection)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8 px-4">
              {sidebarOpen && (
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                  Quick Actions
                </h2>
              )}

              <ul className="space-y-1">
                <li>
                  <Link
                    to="/resume"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg mr-3">👁️</span>
                    {sidebarOpen && 'Preview Resume'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/files"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg mr-3">📁</span>
                    {sidebarOpen && 'File Manager'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/theme-settings"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg mr-3">🎨</span>
                    {sidebarOpen && 'Theme Settings'}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Resume Panel
                    </h1>
                    <span className="px-2 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full">
                      Development Only
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage all sections of your resume
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                  to="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Preview Resume
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto admin-scrollbar">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};