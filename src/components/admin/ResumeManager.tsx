import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { SchemaDefinition } from '../../lib/admin/types';

interface ResumeManagerProps {
  schemas: Record<string, SchemaDefinition>;
}

interface CollectionStats {
  total: number;
  recent: number;
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
    resumePersonal: 'Personal Information',
    resumeExperience: 'Work Experience',
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

const getCollectionDescription = (collection: string): string => {
  const descriptions: Record<string, string> = {
    resumePersonal: 'Manage your personal details, contact information, and professional summary',
    resumeExperience: 'Add and edit your work history, job titles, and achievements',
    resumeEducation: 'Track your educational background, degrees, and academic accomplishments',
    resumeSkills: 'Organize your technical and soft skills by categories',
    resumeCertifications: 'Manage professional certifications and credentials',
    resumeLanguages: 'List languages you speak and your proficiency levels',
    resumeProjects: 'Showcase personal and professional projects'
  };
  return descriptions[collection] || 'Manage this resume section';
};

export const ResumeManager: React.FC<ResumeManagerProps> = ({ schemas }) => {
  const [stats, setStats] = useState<Record<string, CollectionStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsPromises = resumeCollections.map(async (collection) => {
        try {
          const response = await fetch(`/admin/api/content/${collection}`);
          if (response.ok) {
            const data = await response.json();
            const items = data.data?.items || []; // Fix: Access items from data.data.items
            return [collection, {
              total: items.length,
              recent: items.filter((item: any) => {
                const date = new Date(item.lastModified || item.createdAt || 0);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return date > weekAgo;
              }).length
            }];
          }
          return [collection, { total: 0, recent: 0 }];
        } catch {
          return [collection, { total: 0, recent: 0 }];
        }
      });

      const results = await Promise.all(statsPromises);
      setStats(Object.fromEntries(results));
    } catch (error) {
      console.error('Failed to load resume stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resume data...</p>
        </div>
      </div>
    );
  }

  const totalItems = Object.values(stats).reduce((sum, stat) => sum + stat.total, 0);
  const recentItems = Object.values(stats).reduce((sum, stat) => sum + stat.recent, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Resume Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all sections of your resume in one organized place
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalItems}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Items
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {resumeCollections.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Resume Sections
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalItems}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Entries
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {recentItems}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Recent Updates
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Sections Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Resume Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumeCollections.map((collection) => {
            const schema = schemas[collection];
            const collectionStats = stats[collection] || { total: 0, recent: 0 };
            
            if (!schema) return null;

            return (
              <div
                key={collection}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {getCollectionIcon(collection)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getCollectionDisplayName(collection)}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {collectionStats.total} items
                          </span>
                          {collectionStats.recent > 0 && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                              {collectionStats.recent} recent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {getCollectionDescription(collection)}
                  </p>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/resume/content/${collection}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors text-center"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/resume/content/${collection}/new`}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-md transition-colors"
                    >
                      Add New
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-2xl">👁️</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Preview Resume
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                View live resume
              </div>
            </div>
          </Link>
          
          <button
            onClick={loadStats}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-2xl">🔄</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Refresh Data
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Update statistics
              </div>
            </div>
          </button>
          
          <Link
            to="/admin"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-2xl">🏠</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Back to Admin
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Main dashboard
              </div>
            </div>
          </Link>
          
          <Link
            to="/files"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-2xl">📁</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                File Manager
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Manage files
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};