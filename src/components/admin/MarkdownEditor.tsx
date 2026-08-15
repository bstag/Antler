import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { logger } from '../../lib/utils/logger';
import {
  Bold,
  Italic,
  Link,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image,
  Columns,
  Eye,
  Edit3,
  UploadCloud
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Write your content here...'
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'split' | 'preview'>('edit');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(400, textarea.scrollHeight) + 'px';
    }
  }, [value]);

  // Generate preview when switching tab or when value changes in split mode
  useEffect(() => {
    if (activeTab === 'preview' || activeTab === 'split') {
      generatePreview();
    }
  }, [activeTab, value]);

  const generatePreview = async () => {
    if (!value.trim()) {
      setPreviewHtml('<p class="text-gray-500 italic">No content to preview</p>');
      return;
    }

    setIsPreviewLoading(true);
    try {
      let html = value
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 overflow-x-auto my-4 text-sm font-mono"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-4 shadow" />')
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-gray-600 dark:text-gray-400">$1</blockquote>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br>');

      html = '<p class="mb-4">' + html + '</p>';

      html = html
        .replace(/<p class="mb-4"><\/p>/g, '')
        .replace(/(<li class="ml-4">.*?<\/li>)/g, (match) => {
          return match.replace(/<\/?p[^>]*>/g, '');
        });

      html = html.replace(/(<li class="ml-4">.*?<\/li>)(\s*<li class="ml-4">.*?<\/li>)*/g, (match) => {
        return '<ul class="list-disc list-inside my-4 space-y-1">' + match + '</ul>';
      });

      const cleanHtml = DOMPurify.sanitize(html);
      setPreviewHtml(cleanHtml);
    } catch (error) {
      logger.error('Preview generation error:', error);
      setPreviewHtml('<p class="text-red-500">Error generating preview</p>');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const val = textarea.value;
    const selectedText = val.substring(start, end);
    const newText = val.substring(0, start) + before + selectedText + after + val.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [onChange]);

  // Upload an image file and insert markdown image tag
  const uploadImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP, GIF)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'images');

      const response = await fetch('/admin/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      const imagePath = result?.data?.path || `/images/${file.name}`;
      const altText = file.name.replace(/\.[^/.]+$/, '');
      
      insertText(`![${altText}](${imagePath})`);
    } catch (err) {
      logger.error('Failed to upload image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [insertText]);

  // Handle Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await uploadImageFile(file);
      }
    }
  };

  // Handle Clipboard Paste
  const handlePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        await uploadImageFile(file);
      }
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertText('[', '](url)');
          break;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ');
    }
  }, [insertText]);

  const toolbarButtons = useMemo(() => [
    {
      label: 'Bold',
      icon: <Bold className="w-4 h-4" />,
      action: () => insertText('**', '**'),
      shortcut: 'Ctrl+B'
    },
    {
      label: 'Italic',
      icon: <Italic className="w-4 h-4" />,
      action: () => insertText('*', '*'),
      shortcut: 'Ctrl+I'
    },
    {
      label: 'Link',
      icon: <Link className="w-4 h-4" />,
      action: () => insertText('[', '](url)'),
      shortcut: 'Ctrl+K'
    },
    {
      label: 'Image',
      icon: <Image className="w-4 h-4" />,
      action: () => fileInputRef.current?.click(),
      shortcut: 'Upload Image'
    },
    {
      label: 'Code',
      icon: <Code className="w-4 h-4" />,
      action: () => insertText('`', '`'),
      shortcut: ''
    },
    {
      label: 'Heading 1',
      icon: <Heading1 className="w-4 h-4" />,
      action: () => insertText('# '),
      shortcut: ''
    },
    {
      label: 'Heading 2',
      icon: <Heading2 className="w-4 h-4" />,
      action: () => insertText('## '),
      shortcut: ''
    },
    {
      label: 'Heading 3',
      icon: <Heading3 className="w-4 h-4" />,
      action: () => insertText('### '),
      shortcut: ''
    },
    {
      label: 'Bullet List',
      icon: <List className="w-4 h-4" />,
      action: () => insertText('- '),
      shortcut: ''
    },
    {
      label: 'Numbered List',
      icon: <ListOrdered className="w-4 h-4" />,
      action: () => insertText('1. '),
      shortcut: ''
    },
    {
      label: 'Quote',
      icon: <Quote className="w-4 h-4" />,
      action: () => insertText('> '),
      shortcut: ''
    }
  ], [insertText]);

  return (
    <div className="space-y-4">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            uploadImageFile(e.target.files[0]);
          }
        }}
      />

      {/* Tab Navigation & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 py-2 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'edit'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 py-2 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'split'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Split Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 py-2 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </nav>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {isUploading && (
            <span className="flex items-center gap-1 text-primary animate-pulse">
              <UploadCloud className="w-3.5 h-3.5" />
              Uploading image...
            </span>
          )}
          <span>{value.length} characters</span>
        </div>
      </div>

      {/* Toolbar */}
      {activeTab !== 'preview' && (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
              aria-label={button.label}
              className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {button.icon}
            </button>
          ))}
        </div>
      )}

      {/* Editor Content Area */}
      {activeTab === 'edit' && (
        <div className="space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-md transition-all ${
              isDragging ? 'ring-2 ring-primary ring-offset-2 border-primary' : ''
            }`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="block w-full min-h-[400px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              style={{ lineHeight: '1.5' }}
            />
            {isDragging && (
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center rounded-md pointer-events-none border-2 border-dashed border-blue-500 text-blue-600 font-semibold text-sm">
                Drop image here to upload & insert
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p><strong>Pro-tip:</strong> Drag & drop or paste (Ctrl+V) images directly into the editor. Use toolbar for formatting.</p>
          </div>
        </div>
      )}

      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-md transition-all ${
              isDragging ? 'ring-2 ring-primary ring-offset-2 border-primary' : ''
            }`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="block w-full min-h-[450px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              style={{ lineHeight: '1.5' }}
            />
            {isDragging && (
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center rounded-md pointer-events-none border-2 border-dashed border-blue-500 text-blue-600 font-semibold text-sm">
                Drop image here to upload
              </div>
            )}
          </div>

          <div className="min-h-[450px] max-h-[600px] overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-inner">
            {isPreviewLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-3">
          <div className="min-h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
            {isPreviewLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';

