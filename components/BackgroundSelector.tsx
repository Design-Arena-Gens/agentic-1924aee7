'use client';

import { Palette } from 'lucide-react';

interface BackgroundSelectorProps {
  background: string;
  onBackgroundChange: (bg: string) => void;
}

export default function BackgroundSelector({ background, onBackgroundChange }: BackgroundSelectorProps) {
  const backgrounds = [
    { id: 'gradient1', name: 'Purple Dream', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'gradient2', name: 'Pink Sunset', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'gradient3', name: 'Ocean Blue', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'gradient4', name: 'Mint Fresh', preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 'solid-dark', name: 'Dark Studio', preview: '#1a1a2e' },
    { id: 'solid-light', name: 'Light Studio', preview: '#f0f0f0' },
  ];

  return (
    <div className="glass-effect-strong rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        Background
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onBackgroundChange(bg.id)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
              background === bg.id
                ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                : 'hover:ring-2 hover:ring-gray-600'
            }`}
            style={{ background: bg.preview }}
            title={bg.name}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
              <span className="text-xs font-medium text-white drop-shadow-lg">
                {bg.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
