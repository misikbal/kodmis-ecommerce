'use client';

import { ReactNode, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'warning' | 'success' | 'error' | 'info';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}: ResponsiveModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    // Mobile-first responsive sizing
    return {
      sm: 'w-full max-w-sm mx-4',
      md: 'w-full max-w-md mx-4 sm:max-w-lg',
      lg: 'w-full max-w-lg mx-4 sm:max-w-2xl',
      xl: 'w-full max-w-2xl mx-4 sm:max-w-4xl',
      full: 'w-full h-full max-w-full max-h-full mx-0'
    }[size];
  };

  const variantIcons = {
    default: null,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />,
    error: <AlertCircle className="h-6 w-6 text-red-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />
  };

  const variantColors = {
    default: 'border-gray-200',
    warning: 'border-yellow-200 bg-yellow-50',
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        {/* Modal */}
        <div
          className={`relative bg-white rounded-lg shadow-xl transform transition-all w-full ${getSizeClasses()} ${className}`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${variantColors[variant]}`}>
              <div className="flex items-center">
                {variantIcons[variant] && (
                  <div className="mr-3">
                    {variantIcons[variant]}
                  </div>
                )}
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Responsive Confirmation Modal
export interface ResponsiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'warning' | 'danger';
  loading?: boolean;
}

export function ResponsiveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'default',
  loading = false
}: ResponsiveConfirmModalProps) {
  const variantStyles = {
    default: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: <Info className="h-6 w-6 text-blue-600" />
    },
    warning: {
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />
    },
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: <AlertCircle className="h-6 w-6 text-red-600" />
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant === 'danger' ? 'error' : variant === 'warning' ? 'warning' : 'default'}
    >
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            {variantStyles[variant].icon}
          </div>
          <p className="text-gray-700 text-sm sm:text-base">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 ${variantStyles[variant].button}`}
          >
            {loading ? 'İşleniyor...' : confirmText}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}

// Responsive Form Modal
export interface ResponsiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveFormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Kaydet',
  cancelText = 'İptal',
  loading = false,
  size = 'md'
}: ResponsiveFormModalProps) {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnOverlayClick={!loading}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : submitText}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
