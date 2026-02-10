import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import type { SchemaDefinition } from '../../lib/admin/types';
import { adminFetch, getAdminBaseUrl } from '../../lib/admin/api-client';
import { logger } from '../../lib/utils/logger';

// Lazy load admin pages to improve initial bundle size
const Dashboard = lazy(() => import('./Dashboard').then(module => ({ default: module.Dashboard })));
const ContentList = lazy(() => import('./ContentList').then(module => ({ default: module.ContentList })));
const ContentEditor = lazy(() => import('./ContentEditor').then(module => ({ default: module.ContentEditor })));
const FileManager = lazy(() => import('./FileManager').then(module => ({ default: module.FileManager })));
const ResumeManager = lazy(() => import('./ResumeManager').then(module => ({ default: module.ResumeManager })));
const ResumeLayout = lazy(() => import('./ResumeLayout').then(module => ({ default: module.ResumeLayout })));
const SiteConfiguration = lazy(() => import('./SiteConfiguration').then(module => ({ default: module.SiteConfiguration })));
const ThemeManager = lazy(() => import('./ThemeManager').then(module => ({ default: module.ThemeManager })));

// Global styles for admin interface
const adminStyles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
  }
  
  [data-theme="dark"] body {
    background-color: #111827;
  }
  
  #admin-root {
    min-height: 100vh;
  }
  
  .admin-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .admin-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  [data-theme="dark"] .admin-scrollbar::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .admin-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  [data-theme="dark"] .admin-scrollbar::-webkit-scrollbar-thumb {
    background: #6b7280;
  }
  
  .admin-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  [data-theme="dark"] .admin-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

interface AdminAppProps {}

const LoadingSpinner = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

const AdminApp: React.FC<AdminAppProps> = () => {
  const [schemas, setSchemas] = useState<Record<string, SchemaDefinition>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inject admin styles
    const styleElement = document.createElement('style');
    styleElement.textContent = adminStyles;
    document.head.appendChild(styleElement);

    // Load schemas
    loadSchemas();

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const loadSchemas = async () => {
    try {
      setLoading(true);
      const collections = ['blog', 'projects', 'docs', 'resumePersonal', 'resumeExperience', 'resumeEducation', 'resumeSkills', 'resumeCertifications', 'resumeLanguages', 'resumeProjects'];
      const schemaPromises = collections.map(async (collection) => {
        const response = await adminFetch(`admin/api/schema/${collection}`);
        if (response.ok) {
          const data = await response.json();
          return [collection, data.data];
        }
        return [collection, null];
      });

      const results = await Promise.all(schemaPromises);
      const schemasMap = Object.fromEntries(
        results.filter(([, schema]) => schema !== null)
      );

      setSchemas(schemasMap);
    } catch (err) {
      setError('Failed to load content schemas');
      logger.error('Schema loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin interface...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Admin</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadSchemas}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter out resume collections for main admin
  const mainSchemas = Object.fromEntries(
    Object.entries(schemas).filter(([key]) => !key.startsWith('resume'))
  );

  // Filter resume collections for resume manager
  const resumeSchemas = Object.fromEntries(
    Object.entries(schemas).filter(([key]) => key.startsWith('resume'))
  );

  // Get base URL and construct full admin basename
  const baseUrl = getAdminBaseUrl();
  const adminBasename = baseUrl ? `${baseUrl}/admin` : '/admin';

  return (
    <Router basename={adminBasename}>
      <Routes>
        {/* Resume Manager Routes */}
        <Route path="/resume/*" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ResumeLayout schemas={resumeSchemas}>
              <Routes>
                <Route path="/" element={<ResumeManager schemas={resumeSchemas} />} />
                <Route path="/content/:collection" element={<ContentList schemas={resumeSchemas} />} />
                <Route path="/content/:collection/:id" element={<ContentEditor schemas={resumeSchemas} />} />
              </Routes>
            </ResumeLayout>
          </Suspense>
        } />
        
        {/* Main Admin Routes */}
        <Route path="/*" element={
          <AdminLayout schemas={mainSchemas}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard schemas={mainSchemas} />} />
                <Route path="/content/:collection" element={<ContentList schemas={mainSchemas} />} />
                <Route path="/content/:collection/:id" element={<ContentEditor schemas={mainSchemas} />} />
                <Route path="/files" element={<FileManager />} />
                <Route path="/theme-settings" element={<ThemeManager />} />
                <Route path="/site-config" element={<SiteConfiguration />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
};

export { AdminApp };
export default AdminApp;
