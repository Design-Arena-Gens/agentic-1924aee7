'use client';

import { Volume2 } from 'lucide-react';

interface VoiceControlsProps {
  voice: string;
  setVoice: (voice: string) => void;
}

export default function VoiceControls({ voice, setVoice }: VoiceControlsProps) {
  const voices = [
    { id: 'female1', name: 'Emma - Professional Female', language: 'English' },
    { id: 'female2', name: 'Sarah - Warm Female', language: 'English' },
    { id: 'male1', name: 'James - Professional Male', language: 'English' },
    { id: 'male2', name: 'Michael - Deep Male', language: 'English' },
    { id: 'child1', name: 'Alex - Young Voice', language: 'English' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        Select Voice Model
      </label>
      <select
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
      >
        {voices.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name} ({v.language})
          </option>
        ))}
      </select>
    </div>
  );
}
