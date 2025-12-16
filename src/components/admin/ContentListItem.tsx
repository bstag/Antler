import React from 'react';
import { Link } from 'react-router-dom';
import type { ContentItem } from '../../lib/admin/types';
import { formatDate, getItemPreview, getItemTags } from '../../lib/admin/utils';

interface ContentListItemProps {
  item: ContentItem;
  collectionPath: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

export const ContentListItem = React.memo<ContentListItemProps>(({
  item,
  collectionPath,
  isDeleting,
  onDelete
}) => {
  const tags = getItemTags(item);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            <Link
              to={`${collectionPath}/${item.id}`}
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
            to={`${collectionPath}/${item.id}`}
            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            aria-label={`Edit ${item.title}`}
          >
            <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 shadow-sm text-xs font-medium rounded text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label={isDeleting ? 'Deleting item' : `Delete ${item.title}`}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1.5 w-3 h-3 text-red-700 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="badge badge-primary"
            >
              {tag}
            </span>
          ))}
          {tags.length > 5 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              +{tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
});

ContentListItem.displayName = 'ContentListItem';
