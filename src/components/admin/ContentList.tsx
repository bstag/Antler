import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ContentItem, SchemaDefinition, ContentListResponse } from '../../lib/admin/types';
import { adminFetch } from '../../lib/admin/api-client';
import { logger } from '../../lib/utils/logger';

interface ContentListProps {
  schemas: Record<string, SchemaDefinition>;
}

export const ContentList: React.FC<ContentListProps> = ({ schemas }) => {
  const { collection } = useParams<{ collection: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const limit = 10;
  const schema = collection ? schemas[collection] : null;

  // Detect if we're in the resume manager context
  const isResumeContext = window.location.pathname.startsWith('/admin/resume');
  const getCollectionPath = (collection: string) => {
    return isResumeContext ? `/resume/content/${collection}` : `/content/${collection}`;
  };

  useEffect(() => {
    if (collection && schema) {
      loadItems();
    }
  }, [collection, schema, searchTerm, sortBy, sortOrder, page]);

  const loadItems = async () => {
    if (!collection) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await adminFetch(`admin/api/content/${collection}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load content');
      }

      const result = await response.json();
      
      if (result.success) {
        const data: ContentListResponse = result.data;
        setItems(data.items);
        setTotalItems(data.total);
        setHasMore(data.hasMore);
      } else {
        throw new Error(result.error || 'Failed to load content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      logger.error('Content loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!collection || !confirm('Are you sure you want to delete this item?')) return;

    try {
      setDeleting(id);
      const response = await adminFetch(`admin/api/content/${collection}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Reload the list
          loadItems();
        } else {
          alert('Failed to delete: ' + result.error);
        }
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      logger.error('Delete error:', error);
      alert('Failed to delete item');
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadItems();
  };

  const getCollectionName = (collection: string) => {
    switch (collection) {
      case 'docs':
        return 'Documentation';
      default:
        return collection.charAt(0).toUpperCase() + collection.slice(1);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getItemPreview = (item: ContentItem) => {
    if (item.frontmatter.description) {
      return item.frontmatter.description;
    }
    if (item.content) {
      return item.content.substring(0, 150) + '...';
    }
    return 'No description available';
  };

  const getItemTags = (item: ContentItem) => {
    if (item.frontmatter.tags && Array.isArray(item.frontmatter.tags)) {
      return item.frontmatter.tags;
    }
    if (item.frontmatter.technologies && Array.isArray(item.frontmatter.technologies)) {
      return item.frontmatter.technologies;
    }
    return [];
  };

  if (!collection || !schema) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Collection not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The requested collection does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getCollectionName(collection)}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {totalItems === 0 ? 'No items yet' : 
             totalItems === 1 ? '1 item' : 
             `${totalItems} items`}
          </p>
        </div>
        <Link
          to={`${getCollectionPath(collection)}/new`}
          className="btn-primary inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New {getCollectionName(collection)}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder={`Search ${collection}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="updatedAt">Last Modified</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
              {collection === 'blog' && <option value="publicationDate">Publication Date</option>}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="form-input"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <button
              type="submit"
              className="btn-secondary"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="alert-error">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading content</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={loadItems}
                className="mt-2 text-sm text-red-800 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? `No ${collection} match your search criteria.` : `You haven't created any ${collection} yet.`}
          </p>
          <Link
            to={`${getCollectionPath(collection)}/new`}
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first {getCollectionName(collection).toLowerCase()}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    <Link
                      to={`${getCollectionPath(collection)}/${item.id}`}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {getItemPreview(item)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                    <span>Updated {formatDate(item.updatedAt)}</span>
                    <span>Created {formatDate(item.createdAt)}</span>
                    {item.frontmatter.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`${getCollectionPath(collection)}/${item.id}`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 shadow-sm text-xs font-medium rounded text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                  >
                    {deleting === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              
              {/* Tags */}
              {getItemTags(item).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {getItemTags(item).slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="badge badge-primary"
                    >
                      {tag}
                    </span>
                  ))}
                  {getItemTags(item).length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      +{getItemTags(item).length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalItems > limit && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-md">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasMore}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};