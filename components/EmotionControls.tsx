'use client';

import { Smile, Frown, Angry, Meh, Zap } from 'lucide-react';

interface EmotionControlsProps {
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
  };
  onEmotionChange: (emotion: keyof EmotionControlsProps['emotions'], value: number) => void;
}

export default function EmotionControls({ emotions, onEmotionChange }: EmotionControlsProps) {
  const emotionList = [
    { key: 'happy' as const, label: 'Happy', icon: Smile, color: 'text-yellow-400' },
    { key: 'sad' as const, label: 'Sad', icon: Frown, color: 'text-blue-400' },
    { key: 'angry' as const, label: 'Angry', icon: Angry, color: 'text-red-400' },
    { key: 'surprised' as const, label: 'Surprised', icon: Zap, color: 'text-purple-400' },
    { key: 'neutral' as const, label: 'Neutral', icon: Meh, color: 'text-gray-400' },
  ];

  return (
    <div className="glass-effect-strong rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5" />
        Emotion Control
      </h3>

      <div className="space-y-4">
        {emotionList.map((emotion) => (
          <div key={emotion.key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <emotion.icon className={`w-4 h-4 ${emotion.color}`} />
                <label className="text-sm font-medium">{emotion.label}</label>
              </div>
              <span className="text-sm text-gray-400">{emotions[emotion.key]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={emotions[emotion.key]}
              onChange={(e) => onEmotionChange(emotion.key, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
        <p className="text-xs text-gray-400">
          💡 Tip: Emotions are automatically normalized. Adjust sliders to control the dominant emotion.
        </p>
      </div>
    </div>
  );
}
