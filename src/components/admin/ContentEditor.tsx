import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DynamicForm } from './DynamicForm';
import { MarkdownEditor } from './MarkdownEditor';
import type { ContentItem, SchemaDefinition } from '../../lib/admin/types';

interface ContentEditorProps {
  schemas: Record<string, SchemaDefinition>;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ schemas }) => {
  const { collection, id } = useParams<{ collection: string; id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'frontmatter' | 'content'>('frontmatter');
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const formSubmitRef = useRef<(() => void) | null>(null);

  const [isNew, setIsNew] = useState(id === 'new');
  const schema = collection ? schemas[collection] : null;

  // Detect if we're in the resume manager context
  const isResumeContext = window.location.pathname.startsWith('/admin/resume');
  const getCollectionPath = (collection: string) => {
    return isResumeContext ? `/resume/content/${collection}` : `/content/${collection}`;
  };

  useEffect(() => {
    if (collection && schema) {
      if (isNew) {
        // Initialize with default values for new content
        const defaultFrontmatter: Record<string, any> = {};
        Object.entries(schema.fields).forEach(([key, field]) => {
          if (field.defaultValue !== undefined) {
            defaultFrontmatter[key] = field.defaultValue;
          } else if (field.type === 'array') {
            defaultFrontmatter[key] = [];
          } else if (field.type === 'boolean') {
            defaultFrontmatter[key] = false;
          }
        });
        
        setFrontmatter(defaultFrontmatter);
        setContent('');
        setLoading(false);
      } else {
        loadItem();
      }
    }
  }, [collection, id, schema, isNew]);

  const loadItem = async () => {
    if (!collection || !id || isNew) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/admin/api/content/${collection}/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load content');
      }

      const result = await response.json();
      
      if (result.success) {
        const data: ContentItem = result.data;
        setItem(data);
        setFrontmatter(data.frontmatter);
        setContent(data.content || '');
      } else {
        throw new Error(result.error || 'Failed to load content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      console.error('Content loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDirect = async (frontmatterData: Record<string, any>, contentData: string) => {
    if (!collection || !schema) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);


      const payload = {
        frontmatter: frontmatterData,
        content: contentData
      };

      const url = isNew
        ? `/admin/api/content/${collection}`
        : `/admin/api/content/${collection}/${id}`;

      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      const result = await response.json();

      if (result.success) {
        setHasChanges(false);
        const wasNew = isNew;
        if (wasNew) {
          setIsNew(false);
        }
        setSuccess(wasNew ? 'Content created successfully!' : 'Changes saved successfully!');

        // If this was a new item, update the URL to the edit page without full navigation
        if (wasNew && result.data?.id) {
          const newPath = isResumeContext ? `/admin/resume/content/${collection}/${result.data.id}` : `/admin/content/${collection}/${result.data.id}`;
          window.history.replaceState(null, '', newPath);
          // Reload the item to get the full data
          loadItem();
        } else {
          // Reload the item to get updated timestamps
          loadItem();
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || 'Failed to save content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    // Always save with current state - both frontmatter and content
    // If we're on the frontmatter tab, we need to get the latest form data first
    if (activeTab === 'frontmatter' && formSubmitRef.current) {
      // The form submission will handle saving with the latest frontmatter data
      // and the current content state
      formSubmitRef.current();
      return;
    }

    // If we're on the content tab, save directly with current state
    await handleSaveDirect(frontmatter, content);
  };

  const handleFrontmatterChange = (data: Record<string, any>) => {
    setFrontmatter(data);
    setHasChanges(true);
    setSuccess(null); // Clear success message when making changes
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
    setSuccess(null); // Clear success message when making changes
  };

  const handleCancel = () => {
    if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    if (collection) {
      navigate(getCollectionPath(collection));
    }
  };

  const getCollectionName = (collection: string) => {
    switch (collection) {
      case 'docs':
        return 'Documentation';
      default:
        return collection.charAt(0).toUpperCase() + collection.slice(1);
    }
  };

  if (!collection || !schema) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Collection not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The requested collection does not exist.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Link to={getCollectionPath(collection)} className="hover:text-gray-700 dark:hover:text-gray-300">
              {getCollectionName(collection)}
            </Link>
            <span>/</span>
            <span>{isNew ? 'New' : item?.title || id}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? `New ${getCollectionName(collection)}` : `Edit ${getCollectionName(collection)}`}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Unsaved changes</span>
          )}
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Success Display */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Success</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('frontmatter')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'frontmatter'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Metadata
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Content
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === 'frontmatter' ? (
          <div className="p-6">
            <DynamicForm
              schema={schema}
              data={frontmatter}
              onChange={handleFrontmatterChange}
              onSubmit={(data) => {
                // Always use the current content state when saving from frontmatter tab
                handleSaveDirect(data, content);
              }}
              registerSubmitRef={(submitFn) => formSubmitRef.current = submitFn}
              loading={saving}
              submitLabel={isNew ? 'Create Post' : 'Update Post'}
            />
          </div>
        ) : (
          <div className="p-6">
            <MarkdownEditor
              value={content}
              onChange={handleContentChange}
              placeholder={`Write your ${collection} content here...`}
            />
          </div>
        )}
      </div>

      {/* Item Info (for existing items) */}
      {!isNew && item && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Item Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Created:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-200">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Modified:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-200">
                {new Date(item.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">File Path:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-200 font-mono text-xs">
                src/content/{collection}/{item.id}.md
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Slug:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-200 font-mono text-xs">
                {item.slug}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-300">
          <div><kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Ctrl+S</kbd> Save</div>
          <div><kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Ctrl+1</kbd> Metadata Tab</div>
          <div><kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Ctrl+2</kbd> Content Tab</div>
          <div><kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Esc</kbd> Cancel</div>
        </div>
      </div>
    </div>
  );
};