'use client';

import { ReactNode, forwardRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  Search, 
  Calendar, 
  Upload, 
  X,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    variant = 'default',
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
    
    const variantClasses = {
      default: 'border-gray-300 bg-white',
      filled: 'border-gray-300 bg-gray-50',
      outlined: 'border-2 border-gray-300 bg-transparent'
    };

    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : '';

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1" />
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Password Input
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showPassword = false, onTogglePassword, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          <button
            type="button"
            onClick={onTogglePassword}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    variant = 'default',
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical';
    
    const variantClasses = {
      default: 'border-gray-300 bg-white',
      filled: 'border-gray-300 bg-gray-50',
      outlined: 'border-2 border-gray-300 bg-transparent'
    };

    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : '';

    const textareaClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaClasses}
          {...props}
        />
        
        {error && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1" />
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    options,
    placeholder,
    variant = 'default',
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
    
    const variantClasses = {
      default: 'border-gray-300 bg-white',
      filled: 'border-gray-300 bg-gray-50',
      outlined: 'border-2 border-gray-300 bg-transparent'
    };

    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : '';

    const selectClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1" />
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox Component
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label, 
    error, 
    helperText, 
    variant = 'default',
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
    
    const variantClasses = {
      default: 'bg-white',
      filled: 'bg-gray-50'
    };

    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500' 
      : '';

    const checkboxClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="space-y-1">
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={checkboxClasses}
            {...props}
          />
          {label && (
            <label className="ml-2 text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1" />
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Component
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    label, 
    error, 
    helperText, 
    variant = 'default',
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300';
    
    const variantClasses = {
      default: 'bg-white',
      filled: 'bg-gray-50'
    };

    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500' 
      : '';

    const radioClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="space-y-1">
        <div className="flex items-center">
          <input
            ref={ref}
            type="radio"
            className={radioClasses}
            {...props}
          />
          {label && (
            <label className="ml-2 text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1" />
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// File Upload Component
export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFileSelect: (files: File[]) => void;
  variant?: 'default' | 'filled' | 'outlined';
  className?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    label, 
    error, 
    helperText, 
    accept,
    multiple = false,
    maxSize,
    onFileSelect,
    variant = 'default',
    className = '',
    ...props 
  }, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const baseClasses = 'w-full px-3 py-2 border-2 border-dashed rounded-lg transition-colors cursor-pointer';
    
    const variantClasses = {
      default: 'border-gray-300 bg-white hover:border-gray-400',
      filled: 'border-gray-300 bg-gray-50 hover:border-gray-400',
      outlined: 'border-gray-300 bg-transparent hover:border-gray-400'
    };

    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : '';

    const dragClasses = dragActive 
      ? 'border-blue-400 bg-blue-50' 
      : '';

    const uploadClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${dragClasses} ${className}`;

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(Array.from(e.target.files));
      }
    };

    const handleFiles = (files: File[]) => {
      if (maxSize) {
        const validFiles = files.filter(file => file.size <= maxSize * 1024 * 1024);
        if (validFiles.length !== files.length) {
          // Handle file size error
          console.warn('Some files exceed the maximum size limit');
        }
        setSelectedFiles(validFiles);
        onFileSelect(validFiles);
      } else {
        setSelectedFiles(files);
        onFileSelect(files);
      }
    };

    const removeFile = (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      onFileSelect(newFiles);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div
          className={uploadClasses}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={ref}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
            {...props}
          />
          
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600">Dosya seçin</span> veya sürükleyip bırakın
            </p>
            <p className="text-xs text-gray-500">
              {accept && `Desteklenen formatlar: ${accept}`}
              {maxSize && ` • Maksimum boyut: ${maxSize}MB`}
            </p>
          </div>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-2 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="text-sm text-gray-700">
                    {file.name}
                  </div>
                  <div className="ml-2 text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1" />
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
