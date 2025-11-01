'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tema tipi tanımları
export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  accentDark: string;
  background: string;
  backgroundDark: string;
  surface: string;
  surfaceDark: string;
  text: string;
  textDark: string;
  textSecondary: string;
  textSecondaryDark: string;
  border: string;
  borderDark: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  [key: string]: string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    easeInOut: string;
    easeOut: string;
    easeIn: string;
  };
}

export interface ThemeComponents {
  button: {
    primary: {
      background: string;
      color: string;
      border: string;
      borderRadius: string;
      padding: string;
      fontWeight: string;
      boxShadow: string;
      hover: {
        transform?: string;
        boxShadow?: string;
        background?: string;
        color?: string;
      };
    };
    secondary: {
      background: string;
      color: string;
      border: string;
      borderRadius: string;
      padding: string;
      fontWeight: string;
      hover: {
        background?: string;
        color?: string;
      };
    };
  };
  card: {
    background: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
    padding: string;
    hover: {
      transform?: string;
      boxShadow?: string;
    };
  };
  input: {
    background: string;
    border: string;
    borderRadius: string;
    padding: string;
    focus: {
      borderColor: string;
      boxShadow: string;
    };
  };
}

export interface ThemeLayout {
  header: {
    background: string;
    borderBottom: string;
    height: string;
    logo: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      color: string;
    };
  };
  sidebar: {
    background: string;
    borderRight: string;
    width: string;
  };
  footer: {
    background: string;
    color: string;
    padding: string;
  };
}

export interface ThemeFeatures {
  [key: string]: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  components: ThemeComponents;
  layout: ThemeLayout;
  features: ThemeFeatures;
}

export interface ThemeContextType {
  currentTheme: Theme | null;
  isDarkMode: boolean;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  loadTheme: (themeId: string) => Promise<void>;
  applyThemeToDocument: (theme: Theme, isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Varsayılan tema
const defaultTheme: Theme = {
  id: 'default',
  name: 'Varsayılan',
  description: 'Varsayılan tema',
  category: 'general',
  preview: '/themes/default-preview.jpg',
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    secondary: '#64748b',
    secondaryDark: '#475569',
    accent: '#f59e0b',
    accentDark: '#d97706',
    background: '#ffffff',
    backgroundDark: '#0f172a',
    surface: '#f8fafc',
    surfaceDark: '#1e293b',
    text: '#0f172a',
    textDark: '#f8fafc',
    textSecondary: '#64748b',
    textSecondaryDark: '#94a3b8',
    border: '#e2e8f0',
    borderDark: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      display: 'Inter, system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '0.75rem 1.5rem',
        fontWeight: '600',
        boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px 0 rgba(37, 99, 235, 0.4)',
        },
      },
      secondary: {
        background: 'transparent',
        color: '#2563eb',
        border: '2px solid #2563eb',
        borderRadius: '0.5rem',
        padding: '0.75rem 1.5rem',
        fontWeight: '600',
        hover: {
          background: '#2563eb',
          color: '#ffffff',
        },
      },
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
    input: {
      background: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      focus: {
        borderColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
      },
    },
  },
  layout: {
    header: {
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      height: '4rem',
      logo: {
        fontFamily: 'Inter',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#2563eb',
      },
    },
    sidebar: {
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      width: '16rem',
    },
    footer: {
      background: '#0f172a',
      color: '#f8fafc',
      padding: '3rem 0',
    },
  },
  features: {
    darkMode: true,
    animations: true,
  },
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);

  // Tema yükleme fonksiyonu
  const loadTheme = async (themeId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/themes/${themeId}`);
      if (response.ok) {
        const theme: Theme = await response.json();
        setCurrentTheme(theme);
        applyThemeToDocument(theme, isDarkMode);
        localStorage.setItem('selectedTheme', themeId);
      } else {
        console.error('Tema yüklenemedi:', themeId);
      }
    } catch (error) {
      console.error('Tema yükleme hatası:', error);
    }
  };

  // Tema uygulama fonksiyonu
  const applyThemeToDocument = (theme: Theme, isDark: boolean) => {
    const root = document.documentElement;
    const colors = theme.colors;

    // CSS değişkenlerini ayarla
    root.style.setProperty('--color-primary', isDark ? colors.primaryDark : colors.primary);
    root.style.setProperty('--color-secondary', isDark ? colors.secondaryDark : colors.secondary);
    root.style.setProperty('--color-accent', isDark ? colors.accentDark : colors.accent);
    root.style.setProperty('--color-background', isDark ? colors.backgroundDark : colors.background);
    root.style.setProperty('--color-surface', isDark ? colors.surfaceDark : colors.surface);
    root.style.setProperty('--color-text', isDark ? colors.textDark : colors.text);
    root.style.setProperty('--color-text-secondary', isDark ? colors.textSecondaryDark : colors.textSecondary);
    root.style.setProperty('--color-border', isDark ? colors.borderDark : colors.border);

    // Tipografi değişkenleri
    root.style.setProperty('--font-primary', theme.typography.fontFamily.primary);
    root.style.setProperty('--font-secondary', theme.typography.fontFamily.secondary);
    root.style.setProperty('--font-display', theme.typography.fontFamily.display);

    // Spacing değişkenleri
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Border radius değişkenleri
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Shadow değişkenleri
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Animasyon değişkenleri
    root.style.setProperty('--animation-duration-fast', theme.animations.duration.fast);
    root.style.setProperty('--animation-duration-normal', theme.animations.duration.normal);
    root.style.setProperty('--animation-duration-slow', theme.animations.duration.slow);
    root.style.setProperty('--animation-easing-ease-in-out', theme.animations.easing.easeInOut);
    root.style.setProperty('--animation-easing-ease-out', theme.animations.easing.easeOut);
    root.style.setProperty('--animation-easing-ease-in', theme.animations.easing.easeIn);

    // Dark mode class'ını ekle/çıkar
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Tema değiştirme fonksiyonu
  const setTheme = (themeId: string) => {
    loadTheme(themeId);
  };

  // Dark mode toggle fonksiyonu
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (currentTheme) {
      applyThemeToDocument(currentTheme, newDarkMode);
    }
  };

  // Mevcut temaları yükle
  useEffect(() => {
    const loadAvailableThemes = async () => {
      try {
        const themes: Theme[] = [
          defaultTheme,
          // Diğer temalar buraya eklenecek
        ];
        setAvailableThemes(themes);
      } catch (error) {
        console.error('Temalar yüklenemedi:', error);
      }
    };

    loadAvailableThemes();
  }, []);

  // Sayfa yüklendiğinde kaydedilen ayarları geri yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';

    if (savedTheme) {
      loadTheme(savedTheme);
    }

    setIsDarkMode(savedDarkMode);
  }, []);

  // Tema değiştiğinde CSS'i güncelle
  useEffect(() => {
    if (currentTheme) {
      applyThemeToDocument(currentTheme, isDarkMode);
    }
  }, [currentTheme, isDarkMode]);

  const value: ThemeContextType = {
    currentTheme,
    isDarkMode,
    availableThemes,
    setTheme,
    toggleDarkMode,
    loadTheme,
    applyThemeToDocument,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
