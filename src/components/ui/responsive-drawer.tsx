'use client';

import { ReactNode, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function ResponsiveDrawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}: ResponsiveDrawerProps) {
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
    if (position === 'left' || position === 'right') {
      return {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-md sm:max-w-lg',
        lg: 'w-full max-w-lg sm:max-w-2xl',
        xl: 'w-full max-w-2xl sm:max-w-4xl',
        full: 'w-full'
      }[size];
    } else {
      return {
        sm: 'h-full max-h-sm',
        md: 'h-full max-h-md sm:max-h-lg',
        lg: 'h-full max-h-lg sm:max-h-2xl',
        xl: 'h-full max-h-2xl sm:max-h-4xl',
        full: 'h-full'
      }[size];
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 h-full';
      case 'right':
        return 'right-0 top-0 h-full';
      case 'top':
        return 'top-0 left-0 w-full';
      case 'bottom':
        return 'bottom-0 left-0 w-full';
      default:
        return 'right-0 top-0 h-full';
    }
  };

  const getAnimationClasses = () => {
    switch (position) {
      case 'left':
        return 'transform transition-transform duration-300 ease-in-out';
      case 'right':
        return 'transform transition-transform duration-300 ease-in-out';
      case 'top':
        return 'transform transition-transform duration-300 ease-in-out';
      case 'bottom':
        return 'transform transition-transform duration-300 ease-in-out';
      default:
        return 'transform transition-transform duration-300 ease-in-out';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Drawer */}
      <div
        className={`fixed ${getPositionClasses()} ${getSizeClasses()} ${getAnimationClasses()} bg-white shadow-xl ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Responsive Slide Over (Right-side drawer)
export interface ResponsiveSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function ResponsiveSlideOver({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}: ResponsiveSlideOverProps) {
  return (
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      position="right"
      size={size}
      showCloseButton={showCloseButton}
      closeOnOverlayClick={closeOnOverlayClick}
      className={className}
    >
      {children}
    </ResponsiveDrawer>
  );
}

// Responsive Detail Drawer
export interface ResponsiveDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
}

export function ResponsiveDetailDrawer({
  isOpen,
  onClose,
  title,
  children,
  actions,
  loading = false
}: ResponsiveDetailDrawerProps) {
  return (
    <ResponsiveSlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            {children}
            
            {actions && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  {actions}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ResponsiveSlideOver>
  );
}

// Responsive Form Drawer
export interface ResponsiveFormDrawerProps {
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

export function ResponsiveFormDrawer({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Kaydet',
  cancelText = 'İptal',
  loading = false,
  size = 'md'
}: ResponsiveFormDrawerProps) {
  return (
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      position="right"
      size={size}
      closeOnOverlayClick={!loading}
    >
      <form onSubmit={onSubmit} className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {children}
          </div>
        </div>
        
        <div className="flex-shrink-0 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
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
        </div>
      </form>
    </ResponsiveDrawer>
  );
}
