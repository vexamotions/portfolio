"use client";

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html } from '@react-three/drei';

// Type-safe model configuration
interface ModelConfig {
  path: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
}

// Configuration for models - EDIT THESE VALUES
const MODEL_CONFIGS: ModelConfig[] = [
  // {
  //   path: '/assets/3d/girl_cartoon.glb',
  //   scale: 2.5,
  //   position: [-2, 0, 0],
  //   rotation: [0, 0.2, 0],
  //   label: 'Cartoon Character'
  // },
  {
    path: '/assets/3d/girl.glb',
    scale: 2.5,
    position: [2, 0, 0],
    rotation: [0, -0.5, 0],
    label: 'Character'
  }
];

// Individual model loader - shows at model position
const ModelLoader = () => (
  <Html center>
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-purple-500/20"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-white text-xs mt-2">Loading...</p>
    </div>
  </Html>
);

// Individual Model Component
interface ModelProps {
  config: ModelConfig;
  index: number;
}

const Model: React.FC<ModelProps> = ({ config, index }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const { scene } = useGLTF(config.path);

  // Animate each model with slight variations
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation
      const offset = index * 2;
      groupRef.current.rotation.y = config.rotation[1] + Math.sin(state.clock.elapsedTime * 0.3 + offset) * 0.1;

      // Gentle floating motion
      groupRef.current.position.y = config.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.2;

      // Hover effect - slight tilt
      if (hovered) {
        groupRef.current.rotation.x += (0.1 - groupRef.current.rotation.x) * 0.1;
      } else {
        groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.1;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene.clone()} />
    </group>
  );
};

// 3D Scene Component
const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <spotLight
        position={[8, 8, 8]}
        angle={0.4}
        penumbra={1}
        intensity={1.8}
        castShadow
        color="#00ffff"
      />
      <spotLight
        position={[-8, 8, -8]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#ff00ff"
      />
      <pointLight position={[0, 5, 5]} intensity={1} color="#ffffff" />

      {/* Render each model with its own suspense boundary for progressive loading */}
      {MODEL_CONFIGS.map((config, index) => (
        <Suspense key={config.path} fallback={<ModelLoader />}>
          <Model config={config} index={index} />
        </Suspense>
      ))}

      {/* Interactive camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        rotateSpeed={0.5}
      />
    </>
  );
};

// Main Hero Component
const Hero3DStudio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for fonts to load
    const loadContent = async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 900);
    };

    loadContent();
  }, []);

  return (
    <section id='home' className="relative w-full h-screen bg-black overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none"></div>

          <div className="relative z-10 text-center">
            <div className="relative text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
              {/* Background text (always visible, dim) */}
              <div className="text-gray-800 opacity-40">
                <span>VEXA</span>
                <span>MOTIONS</span>
              </div>

              {/* Animated fill overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="animate-fill-mask">
                  <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">VEXA</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">MOTIONS</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          <style jsx>{`
      @keyframes fill-mask {
        0% { 
          clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
        }
        100% { 
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }
      .animate-fill-mask {
        animation: fill-mask 2s ease-in-out;
      }
    `}</style>
        </div>
      )}
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* 3D Canvas Container - Right side */}
      <div className="absolute inset-0 md:left-1/4 lg:left-1/3">
        <Canvas
          className="w-full h-full"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Hero Text Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-6">
              <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                JOIN THE
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                NEW ERA
              </span>
              <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                OF CREATIVE
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Where imagination meets innovation. Crafting digital experiences that transcend boundaries.
            </p>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-500 text-sm tracking-widest">SCROLL</span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none"></div>
    </section>
  );
};

export default Hero3DStudio;