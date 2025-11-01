'use client';

import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcut {
  key: string;
  description: string;
  category: string;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ shortcuts, isOpen, onClose }: KeyboardShortcutsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const categories = ['all', ...Array.from(new Set(shortcuts.map(s => s.category)))];

  const filteredShortcuts = selectedCategory === 'all' 
    ? shortcuts 
    : shortcuts.filter(shortcut => shortcut.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Keyboard className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Klavye Kısayolları</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
              aria-label="Kısayolları kapat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Filtresi:
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Tümü' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{shortcut.description}</div>
                    <div className="text-sm text-gray-600 capitalize">{shortcut.category}</div>
                  </div>
                  <div className="ml-4">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-blue-600">
                      {shortcut.key}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>İpucu:</strong> Bu kısayolları kapatmak için <kbd className="px-1 py-0.5 bg-blue-100 border border-blue-300 rounded text-xs font-mono">Escape</kbd> tuşuna basın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
