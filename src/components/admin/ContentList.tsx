import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import type { ContentItem, SchemaDefinition, ContentListResponse } from '../../lib/admin/types';
import { adminFetch } from '../../lib/admin/api-client';
import { logger } from '../../lib/utils/logger';
import { useDebounce } from '../../lib/hooks';
import { ContentListItem } from './ContentListItem';
import { getCollectionName } from '../../lib/admin/utils';

interface ContentListProps {
  schemas: Record<string, SchemaDefinition>;
}

// Inner component that handles the actual list logic
// It accepts collection as a prop to allow the parent to control remounting via key
const ContentListInner: React.FC<ContentListProps & { collection: string }> = ({ schemas, collection }) => {
  const location = useLocation();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const prevSearchRef = useRef(debouncedSearchTerm);

  const limit = 10;
  const schema = collection ? schemas[collection] : null;

  // Detect if we're in the resume manager context
  const isResumeContext = location.pathname.startsWith('/admin/resume');

  const getCollectionPath = useCallback((collectionName: string) => {
    return isResumeContext ? `/resume/content/${collectionName}` : `/content/${collectionName}`;
  }, [isResumeContext]);

  const loadItems = useCallback(async () => {
    if (!collection) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm })
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
  }, [collection, page, debouncedSearchTerm, sortBy, sortOrder]);

  // Combined effect to handle search term changes (which reset page) AND loading data
  useEffect(() => {
    if (collection && schema) {
      // Check if search term changed
      if (debouncedSearchTerm !== prevSearchRef.current) {
        prevSearchRef.current = debouncedSearchTerm;
        if (page !== 1) {
          // If search term changed and we are not on page 1, reset to page 1.
          // This will trigger a re-render with page=1.
          // We return here to skip the fetch in this render (which would use the old page).
          // The next render (with page=1) will trigger this effect again, but search term will match ref, so it will proceed to load.
          setPage(1);
          return;
        }
      }

      loadItems();
    }
  }, [collection, schema, loadItems, debouncedSearchTerm, page]);

  const handleDelete = useCallback(async (id: string) => {
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
  }, [collection, loadItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // Reset to page 1; useEffect will trigger loading items when page or searchTerm changes.
  };

  if (!collection || !schema) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Collection not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The requested collection does not exist.</p>
      </div>
    );
  }

  const collectionPath = useMemo(() => getCollectionPath(collection), [collection]);
  const showSkeletons = loading && items.length === 0;

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
          to={`${collectionPath}/new`}
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
              aria-label={`Search ${collection}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              aria-label="Sort by field"
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
              aria-label="Sort order"
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
      {showSkeletons ? (
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
            to={`${collectionPath}/new`}
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first {getCollectionName(collection).toLowerCase()}
          </Link>
        </div>
      ) : (
        <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          {items.map((item) => (
            <ContentListItem
              key={item.id}
              item={item}
              collectionPath={collectionPath}
              isDeleting={deleting === item.id}
              onDelete={handleDelete}
            />
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

// Wrapper component to handle routing key
export const ContentList: React.FC<ContentListProps> = (props) => {
  const { collection } = useParams<{ collection: string }>();

  if (!collection) {
    return null;
  }

  return (
    <ContentListInner
      key={collection}
      {...props}
      collection={collection}
    />
  );
};
