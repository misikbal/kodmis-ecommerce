'use client';

import { ReactNode, useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Loader2,
  Bell,
  Shield,
  Zap,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  AlertCircleIcon
} from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'danger';

export interface AlertProps {
  id?: string;
  title?: string;
  message: string;
  type: AlertType;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  dismissible?: boolean;
  duration?: number;
  icon?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  }>;
  onClose?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  id,
  title,
  message,
  type,
  variant = 'default',
  size = 'md',
  closable = false,
  dismissible = false,
  duration,
  icon,
  actions,
  onClose,
  onDismiss,
  className = ''
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (duration && duration > 0 && dismissible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, dismissible]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  const handleClose = () => {
    handleDismiss();
    onClose?.();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'error':
      case 'danger':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      default:
        return <AlertCircleIcon className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'rounded-lg border transition-all duration-300';
    const sizeStyles = {
      sm: 'p-3 text-sm',
      md: 'p-4 text-base',
      lg: 'p-5 text-lg'
    };

    if (variant === 'filled') {
      const colorStyles = {
        success: 'bg-green-500 text-white border-green-600',
        error: 'bg-red-500 text-white border-red-600',
        danger: 'bg-red-600 text-white border-red-700',
        warning: 'bg-yellow-500 text-white border-yellow-600',
        info: 'bg-blue-500 text-white border-blue-600',
        loading: 'bg-blue-500 text-white border-blue-600'
      };
      return `${baseStyles} ${sizeStyles[size]} ${colorStyles[type]} ${className}`;
    }

    if (variant === 'outlined') {
      const colorStyles = {
        success: 'bg-transparent border-green-500 text-green-700',
        error: 'bg-transparent border-red-500 text-red-700',
        danger: 'bg-transparent border-red-600 text-red-700',
        warning: 'bg-transparent border-yellow-500 text-yellow-700',
        info: 'bg-transparent border-blue-500 text-blue-700',
        loading: 'bg-transparent border-blue-500 text-blue-700'
      };
      return `${baseStyles} ${sizeStyles[size]} ${colorStyles[type]} ${className}`;
    }

    if (variant === 'minimal') {
      const colorStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        danger: 'bg-red-50 border-red-300 text-red-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        loading: 'bg-blue-50 border-blue-200 text-blue-800'
      };
      return `${baseStyles} ${sizeStyles[size]} ${colorStyles[type]} ${className}`;
    }

    // Default variant
    const colorStyles = {
      success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
      error: 'bg-red-50 border-l-4 border-red-500 text-red-800',
      danger: 'bg-red-50 border-l-4 border-red-600 text-red-900',
      warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
      info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
      loading: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800'
    };
    return `${baseStyles} ${sizeStyles[size]} ${colorStyles[type]} ${className}`;
  };

  const getIconColor = () => {
    if (variant === 'filled') return 'text-white';
    const colorStyles = {
      success: 'text-green-600',
      error: 'text-red-600',
      danger: 'text-red-700',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
      loading: 'text-blue-600'
    };
    return colorStyles[type];
  };

  return (
    <div
      className={`${getStyles()} ${
        isDismissing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`font-semibold mb-1 ${
              variant === 'filled' ? 'text-white' : ''
            }`}>
              {title}
            </h3>
          )}
          <p className={variant === 'filled' ? 'text-white/90' : ''}>
            {message}
          </p>
          {actions && actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actions.map((action, index) => {
                const buttonStyles = {
                  primary: variant === 'filled' 
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700',
                  secondary: variant === 'filled'
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                  danger: variant === 'filled'
                    ? 'bg-white text-red-600 hover:bg-gray-100'
                    : 'bg-red-600 text-white hover:bg-red-700',
                  ghost: variant === 'filled'
                    ? 'text-white hover:bg-white/20'
                    : 'text-gray-700 hover:bg-gray-100'
                };
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      buttonStyles[action.variant || 'primary']
                    }`}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {(closable || dismissible) && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                variant === 'filled'
                  ? 'text-white hover:bg-white/20 focus:ring-white'
                  : 'text-gray-400 hover:text-gray-600 focus:ring-gray-500'
              }`}
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Alert Container
export interface AlertContainerProps {
  alerts: AlertProps[];
  onDismiss?: (id: string) => void;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  maxAlerts?: number;
  className?: string;
}

export function AlertContainer({
  alerts,
  onDismiss,
  position = 'top',
  maxAlerts = 5,
  className = ''
}: AlertContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const visibleAlerts = alerts.slice(0, maxAlerts);

  return (
    <div className={`fixed z-50 ${getPositionClasses()} w-full max-w-md ${className}`}>
      <div className="space-y-3">
        {visibleAlerts.map((alert) => (
          <Alert
            key={alert.id || Math.random().toString()}
            {...alert}
            onDismiss={() => {
              alert.onDismiss?.();
              if (alert.id) {
                onDismiss?.(alert.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Alert Hook
export interface AlertOptions {
  title?: string;
  variant?: AlertProps['variant'];
  size?: AlertProps['size'];
  closable?: boolean;
  dismissible?: boolean;
  duration?: number;
  icon?: ReactNode;
  actions?: AlertProps['actions'];
  onClose?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function useAlert() {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const addAlert = (
    message: string,
    type: AlertType,
    options: AlertOptions = {}
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: AlertProps = {
      id,
      message,
      type,
      dismissible: true,
      ...options,
    };

    setAlerts((prev) => [...prev, newAlert]);
    return id;
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const success = (message: string, options?: AlertOptions) => {
    return addAlert(message, 'success', options);
  };

  const error = (message: string, options?: AlertOptions) => {
    return addAlert(message, 'error', options);
  };

  const danger = (message: string, options?: AlertOptions) => {
    return addAlert(message, 'danger', options);
  };

  const warning = (message: string, options?: AlertOptions) => {
    return addAlert(message, 'warning', options);
  };

  const info = (message: string, options?: AlertOptions) => {
    return addAlert(message, 'info', options);
  };

  const loading = (message: string, options?: AlertOptions) => {
    return addAlert(message, 'loading', { ...options, duration: 0 });
  };

  const dismiss = (id: string) => {
    removeAlert(id);
  };

  const dismissAll = () => {
    setAlerts([]);
  };

  return {
    alerts,
    success,
    error,
    danger,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
  };
}

// Alert Context - Import at the top
import { createContext, useContext } from 'react';

interface AlertContextType {
  alerts: AlertProps[];
  success: (message: string, options?: AlertOptions) => string;
  error: (message: string, options?: AlertOptions) => string;
  danger: (message: string, options?: AlertOptions) => string;
  warning: (message: string, options?: AlertOptions) => string;
  info: (message: string, options?: AlertOptions) => string;
  loading: (message: string, options?: AlertOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
}

// Alert Provider
export interface AlertProviderProps {
  children: ReactNode;
  position?: AlertContainerProps['position'];
  maxAlerts?: number;
}

export function AlertProvider({
  children,
  position = 'top-right',
  maxAlerts = 5,
}: AlertProviderProps) {
  const alert = useAlert();

  return (
    <AlertContext.Provider value={alert}>
      {children}
      <AlertContainer
        alerts={alert.alerts}
        onDismiss={alert.dismiss}
        position={position}
        maxAlerts={maxAlerts}
      />
    </AlertContext.Provider>
  );
}
