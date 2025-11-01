'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import ThemeSelector from '@/components/admin/ThemeSelector';
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
  Wand2,
  Save,
  RotateCcw,
  Copy,
  Trash2
} from 'lucide-react';

export default function ThemeSettingsPage() {
  const { currentTheme, isDarkMode, availableThemes, setTheme, toggleDarkMode } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [customTheme, setCustomTheme] = useState<any>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // AI tema önerileri al
  const fetchAISuggestions = async () => {
    try {
      const response = await fetch('/api/themes/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productCategories: ['electronics', 'technology'], // Örnek kategoriler
          brandColors: ['#2563eb', '#1d4ed8'], // Örnek marka renkleri
          preferences: {
            style: 'modern',
            layout: 'grid',
            animations: true
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('AI önerileri alınamadı:', error);
    }
  };

  useEffect(() => {
    fetchAISuggestions();
  }, []);

  // Özel tema kaydetme
  const saveCustomTheme = async () => {
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customTheme),
      });

      if (response.ok) {
        alert('Özel tema başarıyla kaydedildi!');
        setCustomizing(false);
        setCustomTheme(null);
      }
    } catch (error) {
      console.error('Tema kaydedilemedi:', error);
    }
  };

  // Tema dışa aktarma
  const exportTheme = () => {
    if (currentTheme) {
      const dataStr = JSON.stringify(currentTheme, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${currentTheme.id}-theme.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tema Ayarları
            </h1>
            <p className="text-gray-600 mt-2">
              Mağazanızın görünümünü özelleştirin ve profesyonel temalar seçin
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-sm text-gray-700">
                {isDarkMode ? 'Açık Mod' : 'Karanlık Mod'}
              </span>
            </button>
            <button
              onClick={() => setShowThemeSelector(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Palette className="h-4 w-4" />
              <span>Tema Seç</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mevcut Tema Bilgileri */}
      {currentTheme && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Mevcut Tema
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportTheme}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Dışa Aktar</span>
              </button>
              <button
                onClick={() => setCustomizing(true)}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Özelleştir</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tema Önizleme */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Tema Önizleme
              </h3>
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                <div className="h-full bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <span className="font-semibold text-gray-900">
                        {currentTheme.name}
                      </span>
                    </div>
                    <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-blue-500 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tema Detayları */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Tema Detayları
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Ad:</span>
                  <p className="text-gray-900">{currentTheme.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Açıklama:</span>
                  <p className="text-gray-900">{currentTheme.description}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Kategori:</span>
                  <p className="text-gray-900 capitalize">{currentTheme.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Ana Renk:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    ></div>
                    <span className="text-sm text-gray-900">
                      {currentTheme.colors.primary}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Font:</span>
                  <p className="text-gray-900" style={{ fontFamily: currentTheme.typography.fontFamily.primary }}>
                    {currentTheme.typography.fontFamily.primary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Önerileri */}
      {aiSuggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span>AI Destekli Öneriler</span>
            </h2>
            <button
              onClick={fetchAISuggestions}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Wand2 className="h-4 w-4" />
              <span>Yenile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setTheme(suggestion.themeId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {suggestion.name}
                    </h4>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {Math.round(suggestion.confidence * 100)}% uyum
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {suggestion.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {suggestion.reasoning}
                  </p>
                <button className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  Bu Temayı Seç
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tema Galerisi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Tema Galerisi
          </h2>
          <button
            onClick={() => setShowThemeSelector(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Tüm Temaları Görüntüle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availableThemes.slice(0, 8).map((theme) => (
            <div
              key={theme.id}
              className={`bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
                currentTheme?.id === theme.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme(theme.id)}
            >
              {/* Tema Önizleme */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-center">
                  <div 
                    className="w-8 h-8 rounded-lg mx-auto mb-2"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div className="text-xs text-gray-600">
                    {theme.name}
                  </div>
                </div>
              </div>

              {/* Tema Bilgileri */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  {theme.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {theme.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {theme.category}
                  </span>
                  {currentTheme?.id === theme.id && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tema Seçici Modal */}
      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}

      {/* Özelleştirme Modal */}
      {customizing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Tema Özelleştirme
              </h3>
              <button
                onClick={() => setCustomizing(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Tema Özelleştirme Yakında
                </h4>
                <p className="text-gray-600 mb-6">
                  Renk, tipografi ve bileşen özelleştirme özellikleri yakında eklenecek.
                </p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => setCustomizing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={saveCustomTheme}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
