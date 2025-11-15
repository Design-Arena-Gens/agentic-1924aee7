'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Play, Pause, RotateCcw, Download,
  Image as ImageIcon, Video, Mic, Volume2, Camera,
  Smile, Frown, Angry, Meh, Eye, Hand
} from 'lucide-react';
import AvatarCanvas from '@/components/AvatarCanvas';
import EmotionControls from '@/components/EmotionControls';
import VoiceControls from '@/components/VoiceControls';
import CameraControls from '@/components/CameraControls';
import BackgroundSelector from '@/components/BackgroundSelector';
import AvatarSelector from '@/components/AvatarSelector';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'text' | 'audio' | 'video'>('text');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('male1');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [emotions, setEmotions] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    neutral: 100
  });
  const [cameraAngle, setCameraAngle] = useState('front');
  const [background, setBackground] = useState('gradient1');
  const [text, setText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [voice, setVoice] = useState('female1');
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<any>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handlePlay = async () => {
    setIsPlaying(true);
    setIsGenerating(true);

    // Simulate generation progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsGenerating(false);

    // Start animation
    if (canvasRef.current) {
      canvasRef.current.startAnimation();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (canvasRef.current) {
      canvasRef.current.pauseAnimation();
    }
  };

  const handleRegenerate = async () => {
    setProgress(0);
    setIsPlaying(false);
    handlePlay();
  };

  const handleExport = () => {
    if (canvasRef.current) {
      canvasRef.current.exportVideo();
    }
  };

  const normalizeEmotions = (newEmotions: typeof emotions) => {
    const total = Object.values(newEmotions).reduce((a, b) => a + b, 0);
    if (total === 0) return { ...newEmotions, neutral: 100 };

    const normalized: any = {};
    Object.keys(newEmotions).forEach(key => {
      normalized[key] = Math.round((newEmotions[key as keyof typeof emotions] / total) * 100);
    });
    return normalized;
  };

  const handleEmotionChange = (emotion: keyof typeof emotions, value: number) => {
    const newEmotions = { ...emotions, [emotion]: value };
    setEmotions(normalizeEmotions(newEmotions));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold gradient-text mb-3">
            AI Lip Sync Avatar
          </h1>
          <p className="text-gray-400 text-lg">
            Create realistic AI-powered avatar animations with emotion and voice sync
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Avatar Selection */}
            <div className="glass-effect-strong rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Avatar Selection
              </h3>

              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onSelectAvatar={setSelectedAvatar}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Or Upload Custom Face
                </label>
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {customImage && (
                  <div className="mt-2 text-sm text-green-400">
                    ✓ Custom image uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Voice Input */}
            <div className="glass-effect-strong rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Voice Input
              </h3>

              <div className="flex gap-2 mb-4">
                {[
                  { id: 'text', icon: Mic, label: 'Text' },
                  { id: 'audio', icon: Volume2, label: 'Audio' },
                  { id: 'video', icon: Video, label: 'Video' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'text' && (
                <div>
                  <VoiceControls voice={voice} setVoice={setVoice} />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to speak..."
                    className="w-full mt-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                    rows={4}
                  />
                </div>
              )}

              {activeTab === 'audio' && (
                <div>
                  <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Upload Audio File</span>
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                  {audioFile && (
                    <div className="mt-2 text-sm text-green-400">
                      ✓ {audioFile.name}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'video' && (
                <div>
                  <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Upload Video File</span>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                  {videoFile && (
                    <div className="mt-2 text-sm text-green-400">
                      ✓ {videoFile.name}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Emotion Controls */}
            <EmotionControls
              emotions={emotions}
              onEmotionChange={handleEmotionChange}
            />
          </motion.div>

          {/* Center Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Preview Canvas */}
            <div className="glass-effect-strong rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Real-time Preview
              </h3>

              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                <AvatarCanvas
                  ref={canvasRef}
                  avatar={customImage || selectedAvatar}
                  emotions={emotions}
                  cameraAngle={cameraAngle}
                  background={background}
                  isPlaying={isPlaying}
                />

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-300">Generating... {progress}%</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    disabled={isGenerating}
                    className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    Generate & Play
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 font-semibold"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                )}

                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="glass-effect px-6 py-3 rounded-full flex items-center gap-2 font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-5 h-5" />
                  Regenerate
                </button>

                <button
                  onClick={handleExport}
                  disabled={isGenerating || !isPlaying}
                  className="glass-effect px-6 py-3 rounded-full flex items-center gap-2 font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  Export 1080p
                </button>
              </div>
            </div>

            {/* Camera & Background Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CameraControls
                cameraAngle={cameraAngle}
                onCameraChange={setCameraAngle}
              />

              <BackgroundSelector
                background={background}
                onBackgroundChange={setBackground}
              />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>Powered by AI • Wav2Lip, SadTalker & ElevenLabs Integration</p>
        </motion.div>
      </div>
    </div>
  );
}
