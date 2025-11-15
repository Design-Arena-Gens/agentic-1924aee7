'use client';

import { Camera } from 'lucide-react';

interface CameraControlsProps {
  cameraAngle: string;
  onCameraChange: (angle: string) => void;
}

export default function CameraControls({ cameraAngle, onCameraChange }: CameraControlsProps) {
  const angles = [
    { id: 'front', label: 'Front View', icon: '👤' },
    { id: 'side-left', label: 'Left Side', icon: '↖️' },
    { id: 'side-right', label: 'Right Side', icon: '↗️' },
    { id: 'closeup', label: 'Close-up', icon: '🔍' },
    { id: 'full-body', label: 'Full Body', icon: '🧍' },
  ];

  return (
    <div className="glass-effect-strong rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5" />
        Camera Angle
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {angles.map((angle) => (
          <button
            key={angle.id}
            onClick={() => onCameraChange(angle.id)}
            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-1 ${
              cameraAngle === angle.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="text-2xl">{angle.icon}</span>
            <span className="text-xs font-medium">{angle.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
