'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Loader2 } from 'lucide-react';

interface ThemeButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function ThemeButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button'
}: ThemeButtonProps) {
  const { currentTheme } = useTheme();

  const getVariantStyles = () => {
    const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} text-white shadow-sm hover:shadow-md`;
      case 'secondary':
        return `${baseStyles} text-white shadow-sm hover:shadow-md`;
      case 'outline':
        return `${baseStyles} bg-transparent border-2 hover:bg-opacity-10`;
      case 'ghost':
        return `${baseStyles} bg-transparent hover:bg-opacity-10`;
      case 'destructive':
        return `${baseStyles} text-white shadow-sm hover:shadow-md`;
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getColorStyles = () => {
    const primaryColor = currentTheme?.colors.primary || '#2563eb';
    const secondaryColor = currentTheme?.colors.secondary || '#64748b';
    const errorColor = currentTheme?.colors.error || '#ef4444';
    const textColor = currentTheme?.colors.text || '#111827';
    const textSecondaryColor = currentTheme?.colors.textSecondary || '#6b7280';

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          color: 'white',
          focusRingColor: primaryColor
        };
      case 'secondary':
        return {
          backgroundColor: secondaryColor,
          color: 'white',
          focusRingColor: secondaryColor
        };
      case 'outline':
        return {
          borderColor: primaryColor,
          color: primaryColor,
          focusRingColor: primaryColor,
          hoverBackgroundColor: primaryColor
        };
      case 'ghost':
        return {
          color: textColor,
          focusRingColor: primaryColor,
          hoverBackgroundColor: primaryColor
        };
      case 'destructive':
        return {
          backgroundColor: errorColor,
          color: 'white',
          focusRingColor: errorColor
        };
      default:
        return {
          backgroundColor: primaryColor,
          color: 'white',
          focusRingColor: primaryColor
        };
    }
  };

  const colorStyles = getColorStyles();
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const widthStyles = fullWidth ? 'w-full' : '';

  const buttonStyles = {
    ...colorStyles,
    borderRadius: currentTheme?.borderRadius.md || '0.5rem',
    fontFamily: currentTheme?.typography.fontFamily.primary || 'Inter',
    fontWeight: currentTheme?.typography.fontWeight.semibold || '600',
    transition: `all ${currentTheme?.animations.duration.normal || '300ms'} ${currentTheme?.animations.easing.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)'}`,
    transform: 'translateY(0)',
    boxShadow: currentTheme?.shadows.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  };

  const hoverStyles = {
    transform: 'translateY(-1px)',
    boxShadow: currentTheme?.shadows.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const disabledStyles = {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'translateY(0)',
    boxShadow: 'none'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      Object.assign(e.currentTarget.style, hoverStyles);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = buttonStyles.boxShadow;
    }
  };

  return (
    <button
      type={type}
      className={`${variantStyles} ${sizeStyles} ${widthStyles} ${className} ${
        disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={disabled || loading ? { ...buttonStyles, ...disabledStyles } : buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <span>{children}</span>
      </div>
    </button>
  );
}
