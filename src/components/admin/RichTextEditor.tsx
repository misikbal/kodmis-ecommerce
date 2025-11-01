'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Image as ImageIcon,
  Upload,
  X,
  Search,
  Check,
  Link as LinkIcon,
  Unlink,
  Table,
  Minus,
  Undo,
  Redo,
  Eraser,
  Maximize,
  Minimize,
  Eye,
  Code2,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Palette,
  Highlighter
} from 'lucide-react';

interface CloudinaryImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  created_at: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "İçeriğinizi yazın...",
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Advanced editor states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHTMLMode, setIsHTMLMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');

  // Editor içeriğini güncelle
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Formatting fonksiyonları
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Fotoğraf yükleme
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Uploading file:', file.name, file.size, file.type);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data.success) {
        insertImage(data.url, file.name.split('.')[0]);
        loadCloudinaryImages(); // Listeyi yenile
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
    }
  };

  // Fotoğraf ekleme
  const insertImage = (url: string, alt: string) => {
    const imageHtml = `
      <div style="margin: 20px 0; text-align: center;">
        <img 
          src="${url}" 
          alt="${alt}" 
          style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
        />
      </div>
    `;
    
    if (editorRef.current) {
      editorRef.current.innerHTML += imageHtml;
      handleContentChange();
    }
  };

  // Cloudinary fotoğraflarını yükle
  const loadCloudinaryImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch('/api/cloudinary/images?max_results=100');
      const data = await response.json();
      
      if (data.success) {
        console.log('Cloudinary images loaded:', data.images.length, data.images.slice(0, 2));
        setCloudinaryImages(data.images);
      } else {
        console.error('Fotoğraflar yüklenemedi:', data.error);
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Fotoğraf seçimi
  const handleImageSelect = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(prev => prev.filter(url => url !== imageUrl));
    } else {
      setSelectedImages(prev => [...prev, imageUrl]);
    }
  };

  // Seçilen fotoğrafları ekle
  const addSelectedImages = () => {
    selectedImages.forEach(url => {
      insertImage(url, 'Fotoğraf');
    });
    
    setSelectedImages([]);
    setIsImageModalOpen(false);
  };

  // Link ekleme
  const insertLink = () => {
    if (linkUrl) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${linkText || linkUrl}</a>`;
      document.execCommand('insertHTML', false, link);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
      handleContentChange();
    }
  };

  // Link kaldırma
  const removeLink = () => {
    execCommand('unlink');
  };

  // Tablo ekleme
  const insertTable = () => {
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">';
    
    for (let i = 0; i < tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        const tag = i === 0 ? 'th' : 'td';
        tableHTML += `<${tag} style="border: 1px solid #ddd; padding: 12px; text-align: left; ${i === 0 ? 'background-color: #f3f4f6; font-weight: bold;' : ''}">${i === 0 ? `Başlık ${j + 1}` : ''}</${tag}>`;
      }
      tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    
    document.execCommand('insertHTML', false, tableHTML);
    setShowTableModal(false);
    handleContentChange();
  };

  // Yatay çizgi ekleme
  const insertHorizontalLine = () => {
    const hr = '<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 20px 0;" />';
    document.execCommand('insertHTML', false, hr);
    handleContentChange();
  };

  // HTML mod geçişi
  const toggleHTMLMode = () => {
    if (isHTMLMode) {
      // HTML'den visual moda dön
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
        onChange(htmlContent);
      }
    } else {
      // Visual'dan HTML moda geç
      if (editorRef.current) {
        setHtmlContent(editorRef.current.innerHTML);
      }
    }
    setIsHTMLMode(!isHTMLMode);
  };

  // Temizle
  const clearFormatting = () => {
    execCommand('removeFormat');
  };

  // Font boyutu değiştirme
  const changeFontSize = (size: string) => {
    setFontSize(size);
    document.execCommand('fontSize', false, '7');
    const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
    fontElements?.forEach((element) => {
      (element as HTMLElement).removeAttribute('size');
      (element as HTMLElement).style.fontSize = size;
    });
    handleContentChange();
  };

  // Text rengi değiştirme
  const changeTextColor = (color: string) => {
    setTextColor(color);
    execCommand('foreColor', color);
  };

  // Arka plan rengi (highlight)
  const changeBackgroundColor = (color: string) => {
    setBgColor(color);
    execCommand('backColor', color);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'border border-gray-300 rounded-lg'} ${className} flex flex-col`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
        {/* Undo/Redo & Mode Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => execCommand('undo')}
            className="p-2 hover:bg-blue-100 rounded text-gray-700 transition-colors"
            title="Geri Al"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('redo')}
            className="p-2 hover:bg-blue-100 rounded text-gray-700 transition-colors"
            title="Yinele"
          >
            <Redo className="h-4 w-4" />
          </button>
          <button
            onClick={toggleHTMLMode}
            className={`p-2 hover:bg-blue-100 rounded transition-colors ${isHTMLMode ? 'bg-blue-200 text-blue-700' : 'text-gray-700'}`}
            title="HTML Modu"
          >
            <Code2 className="h-4 w-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-blue-100 rounded text-gray-700 transition-colors"
            title="Tam Ekran"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-yellow-100 rounded text-gray-700 font-bold transition-colors"
            title="Kalın (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-yellow-100 rounded text-gray-700 italic transition-colors"
            title="İtalik (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-yellow-100 rounded text-gray-700 underline transition-colors"
            title="Altı Çizili (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('strikeThrough')}
            className="p-2 hover:bg-yellow-100 rounded text-gray-700 transition-colors"
            title="Üstü Çizili"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            onClick={clearFormatting}
            className="p-2 hover:bg-red-100 rounded text-gray-700 transition-colors"
            title="Biçimlendirmeyi Temizle"
          >
            <Eraser className="h-4 w-4" />
          </button>
        </div>

        {/* Font Size & Colors */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <select
            value={fontSize}
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            title="Font Boyutu"
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
          </select>
          
          <div className="relative group">
            <button className="p-2 hover:bg-purple-100 rounded transition-colors" title="Metin Rengi">
              <Palette className="h-4 w-4 text-gray-700" />
            </button>
            <input
              type="color"
              value={textColor}
              onChange={(e) => changeTextColor(e.target.value)}
              className="absolute opacity-0 w-0 h-0"
              onFocus={(e) => e.target.style.opacity = '1'}
              onBlur={(e) => e.target.style.opacity = '0'}
            />
          </div>
          
          <div className="relative group">
            <button className="p-2 hover:bg-purple-100 rounded transition-colors" title="Vurgu Rengi">
              <Highlighter className="h-4 w-4 text-gray-700" />
            </button>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => changeBackgroundColor(e.target.value)}
              className="absolute opacity-0 w-0 h-0"
              onFocus={(e) => e.target.style.opacity = '1'}
              onBlur={(e) => e.target.style.opacity = '0'}
            />
          </div>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-300 rounded text-gray-700"
            title="Madde İşareti"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-gray-300 rounded text-gray-700"
            title="Numaralı Liste"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => execCommand('justifyLeft')}
            className="p-2 hover:bg-green-100 rounded text-gray-700 transition-colors"
            title="Sola Hizala"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className="p-2 hover:bg-green-100 rounded text-gray-700 transition-colors"
            title="Ortala"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className="p-2 hover:bg-green-100 rounded text-gray-700 transition-colors"
            title="Sağa Hizala"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyFull')}
            className="p-2 hover:bg-green-100 rounded text-gray-700 transition-colors"
            title="İki Yana Yasla"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => execCommand('formatBlock', 'h1')}
            className="px-2 py-1 hover:bg-indigo-100 rounded text-gray-700 font-bold text-sm transition-colors"
            title="Başlık 1"
          >
            H1
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'h2')}
            className="px-2 py-1 hover:bg-indigo-100 rounded text-gray-700 font-bold text-sm transition-colors"
            title="Başlık 2"
          >
            H2
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'h3')}
            className="px-2 py-1 hover:bg-indigo-100 rounded text-gray-700 font-bold text-sm transition-colors"
            title="Başlık 3"
          >
            H3
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'p')}
            className="px-2 py-1 hover:bg-indigo-100 rounded text-gray-700 text-sm transition-colors"
            title="Paragraf"
          >
            P
          </button>
        </div>

        {/* Special Blocks */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => execCommand('formatBlock', 'blockquote')}
            className="p-2 hover:bg-teal-100 rounded text-gray-700 transition-colors"
            title="Alıntı"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'pre')}
            className="p-2 hover:bg-teal-100 rounded text-gray-700 transition-colors"
            title="Kod Bloğu"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            onClick={insertHorizontalLine}
            className="p-2 hover:bg-teal-100 rounded text-gray-700 transition-colors"
            title="Yatay Çizgi"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* Links & Tables */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            onClick={() => setShowLinkModal(true)}
            className="p-2 hover:bg-pink-100 rounded text-gray-700 transition-colors"
            title="Link Ekle"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            onClick={removeLink}
            className="p-2 hover:bg-pink-100 rounded text-gray-700 transition-colors"
            title="Link Kaldır"
          >
            <Unlink className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowTableModal(true)}
            className="p-2 hover:bg-pink-100 rounded text-gray-700 transition-colors"
            title="Tablo Ekle"
          >
            <Table className="h-4 w-4" />
          </button>
        </div>

        {/* Images */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-orange-100 rounded text-gray-700 transition-colors"
            title="Fotoğraf Yükle"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              loadCloudinaryImages();
              setIsImageModalOpen(true);
            }}
            className="p-2 hover:bg-orange-100 rounded text-gray-700 transition-colors"
            title="Galeriden Seç"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className={`flex-1 ${isFullscreen ? 'h-full overflow-y-auto' : ''}`}>
        {isHTMLMode ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-800 text-white text-xs font-mono flex items-center justify-between">
              <span>HTML Kaynak Kodu</span>
              <button
                onClick={toggleHTMLMode}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs flex items-center"
              >
                <Eye className="h-3 w-3 mr-1" />
                Görsel Moda Geç
              </button>
            </div>
            <textarea
              value={htmlContent}
              onChange={(e) => {
                setHtmlContent(e.target.value);
                onChange(e.target.value);
              }}
              className="flex-1 p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
              style={{ minHeight: isFullscreen ? 'calc(100vh - 160px)' : '400px' }}
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className={`p-6 focus:outline-none bg-white text-gray-900 prose max-w-none ${
              isFullscreen ? 'min-h-screen' : 'min-h-96'
            }`}
            style={{ outline: 'none' }}
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-blue-600" />
                Link Ekle
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Metni
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tıklanabilir metin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Adresi
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://ornek.com"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={insertLink}
                  disabled={!linkUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Link Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Table className="h-5 w-5 mr-2 text-pink-600" />
                Tablo Ekle
              </h3>
              <button
                onClick={() => setShowTableModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Satır Sayısı
                </label>
                <input
                  type="number"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sütun Sayısı
                </label>
                <input
                  type="number"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  min="1"
                  max="10"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">
                  {tableRows} satır × {tableCols} sütunluk tablo oluşturulacak
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowTableModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={insertTable}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Tablo Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Selection Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Fotoğraf Seç</h3>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Fotoğraf ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Images Grid */}
            <div className="max-h-96 overflow-y-auto mb-4">
              {isLoadingImages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {cloudinaryImages
                    .filter(image => 
                      image.alt.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((image) => (
                      <div
                        key={image.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImages.includes(image.url)
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleImageSelect(image.url)}
                      >
                        <img
                          src={image.thumbnail}
                          alt={image.alt}
                          className="w-full h-24 object-cover"
                        />
                        {selectedImages.includes(image.url) && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          {image.alt}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={addSelectedImages}
                disabled={selectedImages.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seçilenleri Ekle ({selectedImages.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for placeholder and editor styles */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }

        /* Prose styles for better content display */
        .prose {
          line-height: 1.75;
        }

        .prose h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 0;
          margin-bottom: 0.8888889em;
          line-height: 1.1111111;
          color: #111827;
        }

        .prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5555556em;
          margin-bottom: 0.8888889em;
          line-height: 1.3333333;
          color: #111827;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
          line-height: 1.6;
          color: #111827;
        }

        .prose p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }

        .prose a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
        }

        .prose a:hover {
          color: #1d4ed8;
        }

        .prose blockquote {
          font-weight: 500;
          font-style: italic;
          color: #374151;
          border-left-width: 0.25rem;
          border-left-color: #e5e7eb;
          quotes: "\\201C""\\201D""\\2018""\\2019";
          margin-top: 1.6em;
          margin-bottom: 1.6em;
          padding-left: 1em;
          background: #f9fafb;
          padding-top: 0.5em;
          padding-bottom: 0.5em;
          border-radius: 0.375rem;
        }

        .prose ul {
          list-style-type: disc;
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }

        .prose ol {
          list-style-type: decimal;
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }

        .prose li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .prose table {
          width: 100%;
          table-layout: auto;
          text-align: left;
          margin-top: 2em;
          margin-bottom: 2em;
          font-size: 0.875em;
          line-height: 1.7142857;
          border-collapse: collapse;
        }

        .prose thead {
          border-bottom-width: 1px;
          border-bottom-color: #d1d5db;
        }

        .prose thead th {
          color: #111827;
          font-weight: 600;
          vertical-align: bottom;
          padding: 0.5714286em;
          background: #f3f4f6;
        }

        .prose tbody tr {
          border-bottom-width: 1px;
          border-bottom-color: #e5e7eb;
        }

        .prose tbody td {
          vertical-align: top;
          padding: 0.5714286em;
        }

        .prose code {
          color: #111827;
          font-weight: 600;
          font-size: 0.875em;
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
        }

        .prose pre {
          color: #e5e7eb;
          background-color: #1f2937;
          overflow-x: auto;
          font-size: 0.875em;
          line-height: 1.7142857;
          margin-top: 1.7142857em;
          margin-bottom: 1.7142857em;
          border-radius: 0.375rem;
          padding: 0.8571429em 1.1428571em;
        }

        .prose pre code {
          background-color: transparent;
          border-width: 0;
          border-radius: 0;
          padding: 0;
          font-weight: 400;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
        }

        .prose hr {
          border-color: #e5e7eb;
          border-top-width: 1px;
          margin-top: 3em;
          margin-bottom: 3em;
        }
      `}</style>
    </div>
  );
}
