import React, { useState, useRef, useEffect } from 'react';
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
  Quote
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...'
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(400, textarea.scrollHeight) + 'px';
    }
  }, [value]);

  // Generate preview when switching to preview tab
  useEffect(() => {
    if (activeTab === 'preview') {
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
      // Simple markdown to HTML conversion
      // In a real implementation, you might want to use a proper markdown parser
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
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded p-4 overflow-x-auto my-4"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-4" />')
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br>');

      // Wrap in paragraphs
      html = '<p class="mb-4">' + html + '</p>';

      // Clean up empty paragraphs and fix list wrapping
      html = html
        .replace(/<p class="mb-4"><\/p>/g, '')
        .replace(/(<li class="ml-4">.*?<\/li>)/g, (match) => {
          return match.replace(/<\/?p[^>]*>/g, '');
        });

      // Wrap consecutive list items in ul tags
      html = html.replace(/(<li class="ml-4">.*?<\/li>)(\s*<li class="ml-4">.*?<\/li>)*/g, (match) => {
        return '<ul class="list-disc list-inside my-4">' + match + '</ul>';
      });

      // Sentinel: Sanitize HTML to prevent XSS
      const cleanHtml = DOMPurify.sanitize(html);
      setPreviewHtml(cleanHtml);
    } catch (error) {
      logger.error('Preview generation error:', error);
      setPreviewHtml('<p class="text-red-500">Error generating preview</p>');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
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

    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ');
    }
  };

  const toolbarButtons = [
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
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('edit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'edit'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Preview
          </button>
        </nav>
        
        {activeTab === 'edit' && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {value.length} characters
          </div>
        )}
      </div>

      {activeTab === 'edit' ? (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
                aria-label={button.label}
                className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                {button.icon}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="block w-full min-h-[400px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              style={{ lineHeight: '1.5' }}
            />
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p><strong>Markdown shortcuts:</strong> **bold**, *italic*, `code`, # heading, - list, &gt; quote</p>
            <p><strong>Keyboard shortcuts:</strong> Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link), Tab (indent)</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
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

          {/* Preview Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>This is a basic markdown preview. The actual rendering may vary depending on your site's styling.</p>
          </div>
        </div>
      )}
    </div>
  );
};
