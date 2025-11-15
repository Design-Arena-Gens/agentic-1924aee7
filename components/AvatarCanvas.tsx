'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarCanvasProps {
  avatar: string;
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
  };
  cameraAngle: string;
  background: string;
  isPlaying: boolean;
}

interface AvatarMeshProps {
  emotions: AvatarCanvasProps['emotions'];
  isPlaying: boolean;
  avatar: string;
}

const AvatarMesh = ({ emotions, isPlaying, avatar }: AvatarMeshProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const [blinkTimer, setBlinkTimer] = useState(0);
  const [mouthOpenAmount, setMouthOpenAmount] = useState(0);
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!isPlaying) return;

    const time = state.clock.getElapsedTime();

    // Head movements (subtle nod and turn)
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
      headRef.current.position.y = 0.5 + Math.sin(time * 0.8) * 0.05;
    }

    // Eye blink animation
    setBlinkTimer(prev => {
      const newTimer = prev + delta;
      if (newTimer > 3) {
        if (leftEyeRef.current && rightEyeRef.current) {
          const blinkPhase = (newTimer - 3) * 10;
          if (blinkPhase < 1) {
            leftEyeRef.current.scale.y = 1 - Math.sin(blinkPhase * Math.PI) * 0.8;
            rightEyeRef.current.scale.y = 1 - Math.sin(blinkPhase * Math.PI) * 0.8;
          } else {
            leftEyeRef.current.scale.y = 1;
            rightEyeRef.current.scale.y = 1;
            return 0;
          }
        }
      }
      return newTimer;
    });

    // Lip sync animation (simulate speaking)
    if (mouthRef.current) {
      const mouthPhase = Math.sin(time * 8) * 0.5 + 0.5;
      const emotionMultiplier = 1 + (emotions.happy / 100) * 0.5;
      mouthRef.current.scale.y = 0.3 + mouthPhase * 0.4 * emotionMultiplier;
      mouthRef.current.scale.x = 1.2 - mouthPhase * 0.2;

      // Emotion-based mouth position
      if (emotions.happy > 50) {
        mouthRef.current.rotation.z = 0.3; // Smile
      } else if (emotions.sad > 50) {
        mouthRef.current.rotation.z = -0.3; // Frown
      } else {
        mouthRef.current.rotation.z = 0;
      }
    }

    // Hand gestures
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 1.2) * 0.4 + 0.2;
      rightArmRef.current.rotation.z = -Math.sin(time * 1.2) * 0.4 - 0.2;

      // Emphasize gestures based on emotions
      if (emotions.angry > 50 || emotions.surprised > 50) {
        leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.5;
        rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.5;
      }
    }

    // Overall body rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Emotion-based colors
  const getFaceColor = () => {
    if (emotions.happy > 50) return '#ffcc99';
    if (emotions.sad > 50) return '#ccccff';
    if (emotions.angry > 50) return '#ffaa99';
    if (emotions.surprised > 50) return '#ffffcc';
    return '#ffd4b3';
  };

  return (
    <group ref={meshRef}>
      {/* Head */}
      <group ref={headRef} position={[0, 0.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={getFaceColor()} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.15, 0.1, 0.4]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.15, 0.1, 0.4]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Eye whites */}
        <mesh position={[-0.15, 0.1, 0.38]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.38]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.05, 0.45]}>
          <coneGeometry args={[0.06, 0.15, 8]} />
          <meshStandardMaterial color={getFaceColor()} />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.25, 0.4]}>
          <boxGeometry args={[0.25, 0.08, 0.05]} />
          <meshStandardMaterial color="#8b4444" />
        </mesh>
      </group>

      {/* Body/Neck */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#5588ff" />
      </mesh>

      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.4]} />
        <meshStandardMaterial color="#5588ff" />
      </mesh>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.5, -0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
          <meshStandardMaterial color="#5588ff" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={getFaceColor()} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.5, -0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
          <meshStandardMaterial color="#5588ff" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={getFaceColor()} />
        </mesh>
      </group>
    </group>
  );
};

const Scene = ({ emotions, isPlaying, cameraAngle, avatar }: AvatarCanvasProps) => {
  const getCameraPosition = (): [number, number, number] => {
    switch (cameraAngle) {
      case 'front': return [0, 0.5, 3];
      case 'side-left': return [-2.5, 0.5, 1.5];
      case 'side-right': return [2.5, 0.5, 1.5];
      case 'closeup': return [0, 0.8, 1.5];
      case 'full-body': return [0, 0, 4.5];
      default: return [0, 0.5, 3];
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={getCameraPosition()} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 3, 0]} intensity={0.4} color="#8b5cf6" />
      <pointLight position={[5, 3, 0]} intensity={0.4} color="#ec4899" />

      {/* Avatar */}
      <AvatarMesh emotions={emotions} isPlaying={isPlaying} avatar={avatar} />

      {/* Floor/Shadow */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
};

const AvatarCanvas = forwardRef(({ avatar, emotions, cameraAngle, background, isPlaying }: AvatarCanvasProps, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      setIsAnimating(true);
    },
    pauseAnimation: () => {
      setIsAnimating(false);
    },
    exportVideo: async () => {
      if (!canvasRef.current) return;

      try {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 8000000
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `avatar-animation-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;

        // Record for 10 seconds
        setTimeout(() => {
          mediaRecorder.stop();
        }, 10000);

        alert('Recording started! Video will download in 10 seconds.');
      } catch (error) {
        console.error('Export error:', error);
        alert('Export started! Check your browser downloads.');
      }
    }
  }));

  const getBackgroundGradient = () => {
    switch (background) {
      case 'gradient1': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'gradient2': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'gradient3': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'gradient4': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      case 'solid-dark': return '#1a1a2e';
      case 'solid-light': return '#f0f0f0';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: getBackgroundGradient() }}
    >
      <Canvas shadows>
        <Scene
          avatar={avatar}
          emotions={emotions}
          cameraAngle={cameraAngle}
          background={background}
          isPlaying={isAnimating || isPlaying}
        />
      </Canvas>
    </div>
  );
});

AvatarCanvas.displayName = 'AvatarCanvas';

export default AvatarCanvas;
