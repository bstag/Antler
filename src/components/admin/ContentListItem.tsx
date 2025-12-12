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
            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 shadow-sm text-xs font-medium rounded text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
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
  );
});

ContentListItem.displayName = 'ContentListItem';
