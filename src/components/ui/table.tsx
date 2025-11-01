'use client';

import { useState, ReactNode } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal, 
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  actions?: Array<{
    label: string;
    icon: ReactNode;
    onClick: (item: T) => void;
    variant?: 'default' | 'destructive';
  }>;
  bulkActions?: Array<{
    label: string;
    icon: ReactNode;
    onClick: (selectedItems: string[]) => void;
    variant?: 'default' | 'destructive';
  }>;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  onSort,
  sortKey,
  sortDirection,
  actions = [],
  bulkActions = [],
  emptyMessage = 'Veri bulunamadı',
  className = ''
}: TableProps<T>) {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data.map(item => item.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedItems, itemId]);
    } else {
      onSelectionChange?.(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200">
              <div className="h-full bg-gray-50"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Bulk Actions */}
      {selectable && selectedItems.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-900">
                {selectedItems.length} öğe seçildi
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {bulkActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.onClick(selectedItems)}
                  className={`flex items-center px-3 py-1 text-sm rounded-lg ${
                    action.variant === 'destructive'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </button>
              ))}
              <button
                onClick={() => onSelectionChange?.([])}
                className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100"
              >
                Seçimi Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ml-2">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'} text-sm`}
                    >
                      {column.render 
                        ? column.render((item as any)[column.key], item)
                        : (item as any)[column.key]
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={`p-1 rounded ${
                              action.variant === 'destructive'
                                ? 'text-red-600 hover:bg-red-100'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Pre-built action components
export const TableActions = {
  View: { label: 'Görüntüle', icon: <Eye className="h-4 w-4" /> },
  Edit: { label: 'Düzenle', icon: <Edit className="h-4 w-4" /> },
  Delete: { label: 'Sil', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
  Download: { label: 'İndir', icon: <Download className="h-4 w-4" /> },
  Upload: { label: 'Yükle', icon: <Upload className="h-4 w-4" /> }
};

export const BulkActions = {
  Delete: { label: 'Sil', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive' as const },
  Export: { label: 'Dışa Aktar', icon: <Download className="h-4 w-4" /> },
  Activate: { label: 'Aktifleştir', icon: <Check className="h-4 w-4" /> },
  Deactivate: { label: 'Pasifleştir', icon: <X className="h-4 w-4" /> }
};
