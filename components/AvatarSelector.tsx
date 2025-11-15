'use client';

import { User } from 'lucide-react';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  const avatars = [
    { id: 'male1', name: 'Male 1', emoji: '👨', color: '#4a90e2' },
    { id: 'male2', name: 'Male 2', emoji: '👨‍💼', color: '#5e6c84' },
    { id: 'female1', name: 'Female 1', emoji: '👩', color: '#e94b8e' },
    { id: 'female2', name: 'Female 2', emoji: '👩‍💼', color: '#9b59b6' },
    { id: 'young1', name: 'Young 1', emoji: '🧑', color: '#f39c12' },
    { id: 'elderly1', name: 'Elderly', emoji: '👴', color: '#95a5a6' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelectAvatar(avatar.id)}
          className={`relative p-4 rounded-lg transition-all flex flex-col items-center gap-2 ${
            selectedAvatar === avatar.id
              ? 'bg-purple-600 text-white ring-2 ring-purple-400'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: avatar.color + '30' }}
          >
            {avatar.emoji}
          </div>
          <span className="text-xs font-medium">{avatar.name}</span>
          {selectedAvatar === avatar.id && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
