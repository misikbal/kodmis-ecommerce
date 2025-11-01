'use client';

import React, { forwardRef } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Eye, EyeOff, Search, X } from 'lucide-react';

interface ThemeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  onClear?: () => void;
  variant?: 'default' | 'search' | 'password';
}

const ThemeInput = forwardRef<HTMLInputElement, ThemeInputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  onClear,
  variant = 'default',
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const { currentTheme } = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const getInputStyles = () => {
    const baseStyles = {
      backgroundColor: currentTheme?.colors.surface || '#ffffff',
      borderColor: error 
        ? (currentTheme?.colors.error || '#ef4444')
        : isFocused 
          ? (currentTheme?.colors.primary || '#2563eb')
          : (currentTheme?.colors.border || '#e5e7eb'),
      color: currentTheme?.colors.text || '#111827',
      borderRadius: currentTheme?.borderRadius.md || '0.5rem',
      fontFamily: currentTheme?.typography.fontFamily.primary || 'Inter',
      fontSize: currentTheme?.typography.fontSize.base || '1rem',
      transition: `all ${currentTheme?.animations.duration.normal || '300ms'} ${currentTheme?.animations.easing.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)'}`,
      boxShadow: isFocused 
        ? `0 0 0 3px ${currentTheme?.colors.primary || '#2563eb'}20`
        : 'none'
    };

    return baseStyles;
  };

  const getLabelStyles = () => ({
    color: error 
      ? (currentTheme?.colors.error || '#ef4444')
      : (currentTheme?.colors.text || '#111827'),
    fontFamily: currentTheme?.typography.fontFamily.primary || 'Inter',
    fontSize: currentTheme?.typography.fontSize.sm || '0.875rem',
    fontWeight: currentTheme?.typography.fontWeight.medium || '500'
  });

  const getHelperTextStyles = () => ({
    color: error 
      ? (currentTheme?.colors.error || '#ef4444')
      : (currentTheme?.colors.textSecondary || '#6b7280'),
    fontFamily: currentTheme?.typography.fontFamily.primary || 'Inter',
    fontSize: currentTheme?.typography.fontSize.xs || '0.75rem'
  });

  const renderLeftIcon = () => {
    if (variant === 'search' && !leftIcon) {
      return <Search className="h-4 w-4 text-gray-400" />;
    }
    return leftIcon;
  };

  const renderRightIcon = () => {
    if (showPasswordToggle && type === 'password') {
      return (
        <button
          type="button"
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      );
    }

    if (onClear && props.value) {
      return (
        <button
          type="button"
          className="p-1 hover:bg-gray-100 rounded"
          onClick={onClear}
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      );
    }

    return rightIcon;
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          className="block mb-2"
          style={getLabelStyles()}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderLeftIcon() && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {renderLeftIcon()}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-3 py-2 border-2 rounded-lg
            ${leftIcon || variant === 'search' ? 'pl-10' : ''}
            ${renderRightIcon() ? 'pr-10' : ''}
            ${error ? 'border-red-500' : ''}
            focus:outline-none
            ${className}
          `}
          style={getInputStyles()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {renderRightIcon() && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {renderRightIcon()}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p style={getHelperTextStyles()}>
              {error}
            </p>
          )}
          {!error && helperText && (
            <p style={getHelperTextStyles()}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

ThemeInput.displayName = 'ThemeInput';

export default ThemeInput;