import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { SchemaDefinition } from '../../lib/admin/types';
import { adminFetch } from '../../lib/admin/api-client';
import { logger } from '../../lib/utils/logger';

interface DashboardProps {
  schemas: Record<string, SchemaDefinition>;
}

interface CollectionStats {
  total: number;
  recent: number;
  featured?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ schemas }) => {
  const [stats, setStats] = useState<Record<string, CollectionStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Batch stats fetching into a single request
      const response = await adminFetch('admin/api/stats');
      if (response.ok) {
        const data = await response.json();
        const apiStats = data.data;

        // Transform the API response to the format expected by the component
        const statsMap: Record<string, CollectionStats> = {};

        Object.keys(schemas).forEach(collection => {
          const collectionStats = apiStats[collection] || { total: 0 };
          statsMap[collection] = {
            total: collectionStats.total,
            recent: 0,
            featured: 0
          };
        });

        setStats(statsMap);
      } else {
        logger.error('Failed to load dashboard stats');
      }
    } catch (error) {
      logger.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCollectionIcon = (collection: string) => {
    switch (collection) {
      case 'blog':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
        );
      case 'projects':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'docs':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'resumePersonal':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'resumeExperience':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        );
      case 'resumeEducation':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case 'resumeCertifications':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'resumeSkills':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'resumeLanguages':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        );
      case 'resumeProjects':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getCollectionColor = (collection: string) => {
    switch (collection) {
      case 'blog':
        return 'bg-blue-500';
      case 'projects':
        return 'bg-green-500';
      case 'docs':
        return 'bg-purple-500';
      case 'resumePersonal':
        return 'bg-indigo-500';
      case 'resumeExperience':
        return 'bg-orange-500';
      case 'resumeEducation':
        return 'bg-teal-500';
      case 'resumeCertifications':
        return 'bg-yellow-500';
      case 'resumeSkills':
        return 'bg-pink-500';
      case 'resumeLanguages':
        return 'bg-cyan-500';
      case 'resumeProjects':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCollectionName = (collection: string) => {
    switch (collection) {
      case 'docs':
        return 'Documentation';
      case 'resumePersonal':
        return 'Personal Info';
      case 'resumeExperience':
        return 'Experience';
      case 'resumeEducation':
        return 'Education';
      case 'resumeCertifications':
        return 'Certifications';
      case 'resumeSkills':
        return 'Skills';
      case 'resumeLanguages':
        return 'Languages';
      case 'resumeProjects':
        return 'Resume Projects';
      default:
        return collection.charAt(0).toUpperCase() + collection.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="w-24 h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter out resume collections from main admin
  const mainCollections = Object.fromEntries(
    Object.entries(schemas).filter(([collection]) => !collection.startsWith('resume'))
  );

  // Calculate resume stats
  const resumeStats = Object.entries(stats)
    .filter(([collection]) => collection.startsWith('resume'))
    .reduce((total, [, stat]) => total + stat.total, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="admin-welcome-banner rounded-lg shadow-sm text-white p-8">
        <h2 className="text-3xl font-bold mb-2">Welcome to Antler Admin</h2>
        <p className="admin-welcome-text text-lg">
          Manage your static site content with ease. Create, edit, and organize your blog posts, projects, and documentation.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {Object.keys(mainCollections).map((collection) => (
            <Link
              key={collection}
              to={`/content/${collection}/new`}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New {getCollectionName(collection)}
            </Link>
          ))}
        </div>
      </div>

      {/* Content Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content Overview</h3>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
          {/* Main Collections */}
          {Object.entries(mainCollections).map(([collection, schema]) => {
            const collectionStats = stats[collection] || { total: 0, recent: 0, featured: 0 };
            
            return (
              <Link
                key={collection}
                to={`/content/${collection}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg text-white ${getCollectionColor(collection)}`}>
                    {getCollectionIcon(collection)}
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {collectionStats.total}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 admin-link-hover transition-colors">
                  {getCollectionName(collection)}
                </h4>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {schema.fields.length} fields configured
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {collectionStats.total === 0 ? 'No items yet' :
                     collectionStats.total === 1 ? '1 item' :
                     `${collectionStats.total} items`}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 admin-link-icon-hover transition-colors"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/files"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white admin-link-hover transition-colors">
                  Manage Files
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload & organize media</p>
              </div>
            </div>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white admin-link-hover transition-colors">
                  Preview Site
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">View your live site</p>
              </div>
            </div>
          </a>

          <button
            onClick={loadStats}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow group text-left"
          >
            <div className="flex items-center">
              <div className="p-2 admin-icon-box rounded-lg mr-3">
                <svg className="w-5 h-5 admin-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white admin-link-hover transition-colors">
                  Refresh Data
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update statistics</p>
              </div>
            </div>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 admin-icon-box rounded-lg mr-3">
                <svg className="w-5 h-5 admin-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Development Mode</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admin panel active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Content Collections</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(schemas).length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active collections</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Total Fields</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.values(schemas).reduce((total, schema) => total + schema.fields.length, 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Schema fields configured</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Environment</h4>
            <p className="text-2xl font-bold text-green-600">Development</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin panel enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};