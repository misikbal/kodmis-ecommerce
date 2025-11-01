'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { 
  Palette, 
  Eye, 
  Download, 
  Upload, 
  Settings, 
  Check, 
  X,
  Sun,
  Moon,
  Sparkles,
  Wand2
} from 'lucide-react';

interface ThemeSelectorProps {
  onClose?: () => void;
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { currentTheme, isDarkMode, availableThemes, setTheme, toggleDarkMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Tema önizleme fonksiyonu
  const previewTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    setPreviewMode(true);
    setTheme(themeId);
  };

  // Tema seçme fonksiyonu
  const selectTheme = (themeId: string) => {
    setTheme(themeId);
    setPreviewMode(false);
    setSelectedTheme('');
    onClose?.();
  };

  // Önizleme iptal etme
  const cancelPreview = () => {
    setPreviewMode(false);
    setSelectedTheme('');
    if (currentTheme) {
      setTheme(currentTheme.id);
    }
  };

  // AI tema önerileri
  const generateAISuggestions = async () => {
    try {
      // Bu fonksiyon gerçek AI entegrasyonu ile değiştirilecek
      const suggestions = [
        {
          id: 'ai-tech-modern',
          name: 'Modern Teknoloji',
          description: 'AI tarafından önerilen modern teknoloji teması',
          category: 'technology',
          confidence: 0.95
        },
        {
          id: 'ai-fashion-elegant',
          name: 'Zarif Moda',
          description: 'AI tarafından önerilen zarif moda teması',
          category: 'fashion',
          confidence: 0.88
        }
      ];
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('AI önerileri yüklenemedi:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tema Seçici
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Mağazanız için en uygun temayı seçin
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDarkMode ? 'Açık moda geç' : 'Karanlık moda geç'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* AI Önerileri */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>AI Destekli Öneriler</span>
              </h3>
              <button
                onClick={generateAISuggestions}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Wand2 className="h-4 w-4" />
                <span>Önerileri Yenile</span>
              </button>
            </div>
            
            {aiSuggestions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => previewTheme(suggestion.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {suggestion.name}
                      </h4>
                      <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                        {Math.round(suggestion.confidence * 100)}% uyum
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {suggestion.description}
                    </p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        Önizle
                      </button>
                      <button className="flex-1 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 py-2 px-3 rounded-lg text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        Seç
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tema Kategorileri */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profesyonel Temalar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`bg-white dark:bg-gray-800 border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                    currentTheme?.id === theme.id
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => previewTheme(theme.id)}
                >
                  {/* Tema Önizleme */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {theme.name}
                      </div>
                    </div>
                  </div>

                  {/* Tema Bilgileri */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {theme.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {theme.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                        {theme.category}
                      </span>
                      {currentTheme?.id === theme.id && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewTheme(theme.id);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Önizle</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTheme(theme.id);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Seç
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Özel Tema Oluşturma */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Özel Tema Oluştur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCustomizing(true)}
                className="flex items-center justify-center space-x-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Mevcut Temayı Özelleştir</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                <Upload className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Tema İçe Aktar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        {previewMode && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Önizleme Modu:</strong> Değişiklikleri kaydetmek için "Seç" butonuna tıklayın.
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelPreview}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => selectTheme(selectedTheme)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Seç
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
