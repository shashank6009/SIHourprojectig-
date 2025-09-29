'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Printer } from 'lucide-react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

interface A4PreviewProps {
  resumeData: any;
  selectedTemplate: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const templates = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design',
    component: ModernTemplate,
    colors: { primary: '#059669', secondary: '#6b7280' }
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, professional layout',
    component: ClassicTemplate,
    colors: { primary: '#2563eb', secondary: '#64748b' }
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful, design-focused',
    component: CreativeTemplate,
    colors: { primary: '#7c3aed', secondary: '#f59e0b' }
  }
};

export default function A4Preview({ resumeData, selectedTemplate, zoom, onZoomChange }: A4PreviewProps) {
  const [showControls, setShowControls] = useState(true);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const currentTemplate = templates[selectedTemplate as keyof typeof templates] || templates.modern;
  const TemplateComponent = currentTemplate.component;

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 200);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 50);
    onZoomChange(newZoom);
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const handleDownload = async () => {
    // Disable download functionality
    alert('Download functionality has been disabled. Please use the print option or copy content manually if needed.');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Controls */}
      {showControls && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>

          {/* Template Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(templates).map((template) => (
                <button
                  key={template.id}
                  onClick={() => {/* Handle template change */}}
                  className={`p-2 text-xs rounded border ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-gray-500">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="flex gap-1 ml-4">
                {[50, 75, 100, 125].map((level) => (
                  <button
                    key={level}
                    onClick={() => onZoomChange(level)}
                    className={`px-2 py-1 text-xs rounded ${
                      zoom === level ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
            <div className="flex gap-2">
              {[
                { id: 'blue', name: 'Blue', primary: '#2563eb' },
                { id: 'green', name: 'Green', primary: '#059669' },
                { id: 'purple', name: 'Purple', primary: '#7c3aed' },
                { id: 'gray', name: 'Gray', primary: '#6b7280' }
              ].map((scheme) => (
                <button
                  key={scheme.id}
                  className="flex items-center gap-2 px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: scheme.primary }}
                  />
                  {scheme.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* A4 Preview */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <div
            className="a4-container"
            style={{ 
              zoom: `${zoom}%`,
              transform: isPrintMode ? 'scale(1)' : 'none'
            }}
          >
            <div className="a4-page">
              <TemplateComponent 
                data={resumeData} 
                template={currentTemplate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 p-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <style jsx>{`
        .a4-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
        }

        .a4-page {
          width: 210mm;
          height: 297mm;
          background: white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 20mm;
          font-family: Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          overflow: hidden;
          border-radius: 4px;
        }

        @media print {
          .a4-page {
            box-shadow: none;
            margin: 0;
            padding: 20mm;
            width: 100%;
            height: 100%;
          }
          
          .a4-container {
            background: white;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
