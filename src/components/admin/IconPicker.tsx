import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Search, X } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

// Popular curated Lucide icons commonly used across web sites, heros, features, and navigation
const POPULAR_ICONS: string[] = [
  'Zap', 'ArrowRight', 'ArrowLeft', 'Code', 'Rocket', 'Sparkles', 'Briefcase',
  'Globe', 'Database', 'PenTool', 'Image', 'Book', 'BookOpen', 'Server',
  'Shield', 'Lock', 'Star', 'Heart', 'Users', 'User', 'Settings',
  'Terminal', 'Compass', 'FileText', 'CheckCircle', 'ExternalLink', 'Folder',
  'Mail', 'Phone', 'Cpu', 'Layers', 'Layout', 'MessageSquare', 'Search',
  'Share2', 'Sliders', 'Sun', 'Moon', 'Tag', 'ThumbsUp', 'TrendingUp',
  'Video', 'Wrench', 'Activity', 'Award', 'Bell', 'Calendar', 'Camera',
  'Check', 'ChevronRight', 'Clock', 'Cloud', 'Coffee', 'Download', 'Eye',
  'Feather', 'Filter', 'Flag', 'Gift', 'HelpCircle', 'Home', 'Info',
  'Key', 'LifeBuoy', 'Link', 'List', 'MapPin', 'Maximize', 'Minimize',
  'Monitor', 'Package', 'Play', 'Power', 'Printer', 'Radio', 'RefreshCw',
  'Save', 'Send', 'ShoppingBag', 'ShoppingCart', 'Smartphone', 'Trash',
  'Truck', 'Tv', 'Upload', 'Volume2', 'Wifi'
];

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return POPULAR_ICONS;
    const q = search.toLowerCase();
    return POPULAR_ICONS.filter(name => name.toLowerCase().includes(q));
  }, [search]);

  // Dynamically render Lucide icon component safely
  const renderIcon = (name: string, className: string = 'w-4 h-4') => {
    const IconComponent = (Icons as any)[name] || Icons.Sparkles;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm"
        >
          <div className="w-5 h-5 flex items-center justify-center text-primary">
            {renderIcon(value, 'w-5 h-5')}
          </div>
          <span className="font-mono text-xs">{value || 'Select icon'}</span>
          <span className="text-xs text-slate-400">▼</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Clear icon"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Icon Picker Popover */}
      {isOpen && (
        <div className="relative z-50">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-2 left-0 w-80 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 space-y-3 z-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Choose Icon
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons (e.g. arrow, zap)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-700/50 rounded-lg">
              {filteredIcons.map((name) => {
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                    }}
                    className={`p-2 flex flex-col items-center justify-center rounded-lg transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {renderIcon(name, 'w-4 h-4')}
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-6 py-4 text-center text-xs text-slate-400">
                  No icons match "{search}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
