
'use client';

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { motion as motion3d } from 'framer-motion-3d';
import { useState, useEffect } from 'react';

interface NeckStretchProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

export function NeckStretch({ timeLeft, totalTime, isActive }: NeckStretchProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10 py-4 w-full">
        <div className="relative w-full max-w-[400px] h-[400px] mx-auto flex items-center justify-center rounded-3xl overflow-hidden bg-primary/5 border border-primary/10">
          <div className="text-muted-foreground animate-pulse font-bold text-lg">Cargando modelo 3D...</div>
        </div>
      </div>
    );
  }

  const elapsed = totalTime - timeLeft;
  const cycleTime = elapsed % 180;
  
  let headPhase = 'center';
  let shoulderPhase = 'center';
  let instruction = 'Mantén la cabeza recta';
  let phaseTimeLeft = 0;

  if (!isActive) {
    headPhase = 'center';
    shoulderPhase = 'center';
    instruction = 'Presiona Iniciar para comenzar';
    phaseTimeLeft = 0;
  } else if (cycleTime < 15) {
    headPhase = 'center';
    shoulderPhase = 'center';
    instruction = 'Enraízate. Respira profundo desde el abdomen...';
    phaseTimeLeft = 15 - cycleTime;
  } else if (cycleTime < 40) {
    headPhase = 'upDown';
    shoulderPhase = 'center';
    instruction = 'Flexión y Extensión: Levanta la mirada al techo y luego baja la barbilla al pecho.';
    phaseTimeLeft = 40 - cycleTime;
  } else if (cycleTime < 70) {
    headPhase = 'pendulum';
    shoulderPhase = 'center';
    instruction = 'Semicírculos: Balancea la cabeza de lado a lado por delante de tu pecho.';
    phaseTimeLeft = 70 - cycleTime;
  } else if (cycleTime < 85) {
    headPhase = 'tiltLeft';
    shoulderPhase = 'center';
    instruction = 'Mantén tu oreja izquierda hacia el hombro izquierdo.';
    phaseTimeLeft = 85 - cycleTime;
  } else if (cycleTime < 100) {
    headPhase = 'tiltRight';
    shoulderPhase = 'center';
    instruction = 'Mantén tu oreja derecha hacia el hombro derecho.';
    phaseTimeLeft = 100 - cycleTime;
  } else if (cycleTime < 140) {
    headPhase = 'lookLeftRight';
    shoulderPhase = 'center';
    instruction = 'Rotación: Gira la cabeza lentamente de izquierda a derecha (como diciendo "no").';
    phaseTimeLeft = 140 - cycleTime;
  } else {
    headPhase = 'center';
    shoulderPhase = 'rolls';
    instruction = 'Círculos con los hombros hacia atrás. Libera la tensión.';
    phaseTimeLeft = 180 - cycleTime;
  }

  const degToRad = (degrees: number) => degrees * (Math.PI / 180);

  // 3D Fluid Animations for the Head
  const headVariants = {
    center: { 
      rotateZ: 0, rotateX: 0, rotateY: 0, y: 1.5, x: 0, 
      transition: { duration: 1.5, ease: 'easeInOut' } 
    },
    upDown: {
      y: [1.3, 1.7, 1.3], // Moves neck down (compress) and up (stretch)
      rotateX: [degToRad(-45), degToRad(35), degToRad(-45)], // Negative is UP, Positive is DOWN
      transition: { duration: 8, ease: 'easeInOut', repeat: Infinity }
    },
    pendulum: {
      rotateZ: [degToRad(-35), 0, degToRad(35), 0, degToRad(-35)], 
      rotateX: [0, degToRad(25), 0, degToRad(25), 0], // Drops chin
      y: [1.5, 1.35, 1.5, 1.35, 1.5], 
      transition: { duration: 7, ease: 'easeInOut', repeat: Infinity }
    },
    tiltLeft: { 
      rotateZ: degToRad(25), rotateX: 0, rotateY: 0, y: 1.5, x: 0, 
      transition: { duration: 2, ease: 'easeInOut' } 
    },
    tiltRight: { 
      rotateZ: degToRad(-25), rotateX: 0, rotateY: 0, y: 1.5, x: 0, 
      transition: { duration: 2, ease: 'easeInOut' } 
    },
    lookLeftRight: {
      rotateY: [degToRad(-60), degToRad(60), degToRad(-60)], 
      rotateX: [0, 0, 0],
      rotateZ: [0, 0, 0],
      x: [0, 0, 0], 
      y: [1.5, 1.5, 1.5],
      transition: { duration: 8, ease: 'easeInOut', repeat: Infinity }
    }
  };

  // Shoulder Animations
  const shoulderVariants = {
    center: { y: -1.5, scale: 1, rotate: 0, transition: { duration: 1.5 } },
    rolls: {
      y: [-1.5, -1, -1, -1.5, -1.5], // Shrug up
      scale: [1, 1, 1.05, 1.05, 1], // Expand chest
      transition: { duration: 4, ease: 'easeInOut', repeat: Infinity }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-4 w-full">
      <div className="text-center space-y-4">
        <div className="text-2xl md:text-3xl font-black text-primary min-h-[64px] max-w-md mx-auto flex items-center justify-center">
          {instruction}
        </div>
        
        {isActive && (
          <div className="text-xl font-bold text-muted-foreground flex items-center justify-center gap-2">
            <span className="animate-pulse w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            Tiempo de este movimiento: {phaseTimeLeft}s
          </div>
        )}
      </div>

      <div className="relative w-full max-w-[400px] h-[400px] mx-auto flex items-center justify-center rounded-3xl overflow-hidden bg-primary/5 border border-primary/10">
        
        {/* Render 3D Canvas */}
        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, 10, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 5]} intensity={0.8} color="#D9C5E6" />
          
          {/* Torso and Neck */}
          <motion3d.group animate={shoulderPhase} variants={shoulderVariants}>
            {/* Shoulders */}
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[1.6, 1.2, 3, 32]} />
              <meshStandardMaterial color="#523F77" roughness={0.7} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.35, 0.45, 1.5, 16]} />
              <meshStandardMaterial color="#523F77" roughness={0.7} />
            </mesh>
          </motion3d.group>

          {/* Head (Spherical avatar with nose) */}
          <motion3d.group animate={headPhase} variants={headVariants}>
            {/* Main Skull */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[1.1, 32, 32]} />
              <meshStandardMaterial color="#523F77" roughness={0.6} />
            </mesh>
            
            {/* Nose (Cone to indicate direction) */}
            <mesh position={[0, -0.1, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.2, 0.5, 16]} />
              <meshStandardMaterial color="#D9C5E6" roughness={0.4} />
            </mesh>

            {/* Ears */}
            <mesh position={[-1.05, 0, 0.2]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#523F77" roughness={0.6} />
            </mesh>
            <mesh position={[1.05, 0, 0.2]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#523F77" roughness={0.6} />
            </mesh>
          </motion3d.group>
        </Canvas>

      </div>
    </div>
  );
}
