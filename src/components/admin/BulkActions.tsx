'use client';

import { useState } from 'react';
import { Trash2, Tag, Zap, Download, Upload, MoreHorizontal } from 'lucide-react';

interface BulkActionsProps {
  selectedItems: string[];
  onBulkDelete: () => void;
  onBulkUpdate: (action: string, data?: any) => void;
  type: 'products' | 'categories' | 'features' | 'brands';
}

export default function BulkActions({
  selectedItems,
  onBulkDelete,
  onBulkUpdate,
  type
}: BulkActionsProps) {
  const [showActions, setShowActions] = useState(false);

  if (selectedItems.length === 0) return null;

  const handleBulkAction = (action: string) => {
    onBulkUpdate(action);
    setShowActions(false);
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'activate':
        return 'Aktifleştir';
      case 'deactivate':
        return 'Pasifleştir';
      case 'featured':
        return 'Öne Çıkar';
      case 'unfeatured':
        return 'Öne Çıkarmayı Kaldır';
      case 'export':
        return 'Dışa Aktar';
      case 'import':
        return 'İçe Aktar';
      default:
        return action;
    }
  };

  const getAvailableActions = () => {
    const commonActions = [
      { id: 'activate', label: 'Aktifleştir', icon: '✓' },
      { id: 'deactivate', label: 'Pasifleştir', icon: '✗' },
    ];

    if (type === 'products') {
      return [
        ...commonActions,
        { id: 'featured', label: 'Öne Çıkar', icon: '⭐' },
        { id: 'unfeatured', label: 'Öne Çıkarmayı Kaldır', icon: '☆' },
        { id: 'export', label: 'Dışa Aktar', icon: '📥' },
      ];
    }

    if (type === 'categories') {
      return [
        ...commonActions,
        { id: 'export', label: 'Dışa Aktar', icon: '📥' },
      ];
    }

    if (type === 'features') {
      return [
        ...commonActions,
        { id: 'export', label: 'Dışa Aktar', icon: '📥' },
      ];
    }

    if (type === 'brands') {
      return [
        ...commonActions,
        { id: 'export', label: 'Dışa Aktar', icon: '📥' },
      ];
    }

    return commonActions;
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedItems.length}</span> öğe seçildi
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Sil
          </button>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Diğer İşlemler
            </button>

            {showActions && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                {getAvailableActions().map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleBulkAction(action.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span className="mr-2">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowActions(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
