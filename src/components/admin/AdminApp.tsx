import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { Dashboard } from './Dashboard';
import { ContentList } from './ContentList';
import { ContentEditor } from './ContentEditor';
import { FileManager } from './FileManager';
import type { SchemaDefinition } from '../../lib/admin/types';

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
      const collections = ['blog', 'projects', 'docs'];
      const schemaPromises = collections.map(async (collection) => {
        const response = await fetch(`/admin/api/schema/${collection}`);
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
      console.error('Schema loading error:', err);
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/admin">
      <AdminLayout schemas={schemas}>
        <Routes>
          <Route path="/" element={<Dashboard schemas={schemas} />} />
          <Route path="/content/:collection" element={<ContentList schemas={schemas} />} />
          <Route path="/content/:collection/new" element={<ContentEditor schemas={schemas} />} />
          <Route path="/content/:collection/:id" element={<ContentEditor schemas={schemas} />} />
          <Route path="/files" element={<FileManager />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
};

export { AdminApp };
export default AdminApp;