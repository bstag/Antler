import React from 'react';
import type { FileReference } from '../../lib/admin/types';
import { formatFileSize, formatDate, getFileIconJSX } from '../../lib/admin/utils';

interface FileItemProps {
  file: FileReference;
  selected: boolean;
  onToggle: (fileName: string) => void;
  onCopy: (path: string, fileName: string) => void;
  copiedFile: string | null;
  viewMode: 'grid' | 'list';
}

export const FileItem = React.memo<FileItemProps>(({
  file,
  selected,
  onToggle,
  onCopy,
  copiedFile,
  viewMode
}) => {
  if (viewMode === 'grid') {
    return (
      <div
        className={`card-hover overflow-hidden ${
          selected ? 'ring-2' : ''
        }`}
        style={selected ? { borderColor: 'var(--color-primary)' } : undefined}
      >
        <div className="p-4">
          <div className="relative mb-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggle(file.name)}
              className="absolute top-2 left-2 z-10 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label={`Select ${file.name}`}
            />
            {getFileIconJSX(file)}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(file.modifiedAt)}
            </p>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={() => onCopy(file.path, file.name)}
              className={`flex-1 text-xs px-2 py-1 border rounded transition-colors duration-200 flex items-center justify-center gap-1 ${
                copiedFile === file.name
                  ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label={copiedFile === file.name ? `Copied URL for ${file.name}` : `Copy URL for ${file.name}`}
            >
              {copiedFile === file.name ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                'Copy URL'
              )}
            </button>
            {file.type === 'image' && (
              <button
                onClick={() => window.open(file.path, '_blank')}
                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                View
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-hover overflow-hidden ${
        selected ? 'ring-2' : ''
      }`}
      style={selected ? { borderColor: 'var(--color-primary)' } : undefined}
    >
      <div className="p-4 flex items-center space-x-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(file.name)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Select ${file.name}`}
        />
        <div className="w-12 h-12 flex-shrink-0">
          {file.type === 'image' ? (
            <img
              src={file.path}
              alt={file.name}
              className="w-full h-full object-cover rounded"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">
              📄
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.size)} • {formatDate(file.modifiedAt)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCopy(file.path, file.name)}
            className={`text-xs px-3 py-1 border rounded transition-colors duration-200 flex items-center gap-1 ${
              copiedFile === file.name
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label={copiedFile === file.name ? `Copied URL for ${file.name}` : `Copy URL for ${file.name}`}
          >
            {copiedFile === file.name ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              'Copy URL'
            )}
          </button>
          {file.type === 'image' && (
            <button
              onClick={() => window.open(file.path, '_blank')}
              className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

FileItem.displayName = 'FileItem';
