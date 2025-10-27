import React, { useState, useEffect, useRef } from 'react';
import type { FileReference, UploadResult } from '../../lib/admin/types';

export const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentDirectory, setCurrentDirectory] = useState('images');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, [currentDirectory]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        directory: currentDirectory
      });

      const response = await fetch(`/admin/api/files/list?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load files');
      }

      const result = await response.json();
      
      if (result.success) {
        setFiles(result.data.files || []);
      } else {
        throw new Error(result.error || 'Failed to load files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      console.error('File loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadFiles: FileList) => {
    if (!uploadFiles.length) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      Array.from(uploadFiles).forEach((file) => {
        formData.append('files', file);
      });
      formData.append('directory', currentDirectory);

      const response = await fetch('/admin/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const result = await response.json();
      
      if (result.success) {
        // Reload files to show the new uploads
        loadFiles();
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Failed to upload files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const toggleFileSelection = (fileName: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileName)) {
      newSelected.delete(fileName);
    } else {
      newSelected.add(fileName);
    }
    setSelectedFiles(newSelected);
  };

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.name)));
    }
  };

  const getFileIcon = (file: FileReference) => {
    if (file.type === 'image') {
      return (
        <img
          src={file.path}
          alt={file.name}
          className="w-full h-32 object-cover rounded"
          loading="lazy"
        />
      );
    }

    // File type icons
    const extension = file.name.split('.').pop()?.toLowerCase();
    let iconColor = 'text-gray-400';
    let iconContent = '📄';

    switch (extension) {
      case 'pdf':
        iconColor = 'text-red-500';
        iconContent = '📄';
        break;
      case 'doc':
      case 'docx':
        iconColor = 'text-blue-500';
        iconContent = '📝';
        break;
      case 'xls':
      case 'xlsx':
        iconColor = 'text-green-500';
        iconContent = '📊';
        break;
      case 'zip':
      case 'rar':
        iconColor = 'text-yellow-500';
        iconContent = '🗜️';
        break;
      default:
        iconContent = '📄';
    }

    return (
      <div className={`w-full h-32 flex items-center justify-center text-4xl ${iconColor}`}>
        {iconContent}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Manager</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {files.length === 0 ? 'No files yet' : 
             files.length === 1 ? '1 file' : 
             `${files.length} files`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={currentDirectory}
            onChange={(e) => setCurrentDirectory(e.target.value)}
            className="form-input"
          >
            <option value="images">Images</option>
            <option value="documents">Documents</option>
            <option value="assets">Assets</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="btn-secondary p-2"
          >
            {viewMode === 'grid' ? '📋' : '⊞'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-800"
      >
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop files here, or click to select</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert-error">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              <button
                onClick={loadFiles}
                className="mt-2 text-sm text-red-800 dark:text-red-300 underline hover:text-red-900 dark:hover:text-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      {files.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {selectedFiles.size === files.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedFiles.size > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFiles.size} selected
              </span>
            )}
          </div>
          {selectedFiles.size > 0 && (
            <div className="flex items-center space-x-2">
              <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                Delete Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      {loading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-600 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Upload some files to get started.</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {files.map((file) => (
            <div
              key={file.name}
              className={`card-hover overflow-hidden ${
                selectedFiles.has(file.name) ? 'ring-2' : ''
              }`}
              style={selectedFiles.has(file.name) ? { borderColor: 'var(--color-primary)' } : undefined}
            >
              {viewMode === 'grid' ? (
                <div className="p-4">
                  <div className="relative mb-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.name)}
                      onChange={() => toggleFileSelection(file.name)}
                      className="absolute top-2 left-2 z-10 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {getFileIcon(file)}
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
                      onClick={() => copyToClipboard(file.path)}
                      className="flex-1 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Copy URL
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
              ) : (
                <div className="p-4 flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.name)}
                    onChange={() => toggleFileSelection(file.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      onClick={() => copyToClipboard(file.path)}
                      className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Copy URL
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};