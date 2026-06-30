'use client';

import { motion } from 'framer-motion';

interface BoxBreathingProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

export function BoxBreathing({ timeLeft, totalTime, isActive }: BoxBreathingProps) {
  const elapsed = totalTime - timeLeft;
  const cycleTime = elapsed % 16;
  
  let phase = '';
  let instruction = '';

  if (cycleTime < 4) {
    phase = 'inhale';
    instruction = 'Inhala profundamente...';
  } else if (cycleTime < 8) {
    phase = 'hold-full';
    instruction = 'Sostén el aire...';
  } else if (cycleTime < 12) {
    phase = 'exhale';
    instruction = 'Exhala lentamente...';
  } else {
    phase = 'hold-empty';
    instruction = 'Espera...';
  }

  // Animation variants
  const variants = {
    inhale: { scale: 1.6, transition: { duration: 4, ease: 'linear' } },
    'hold-full': { scale: 1.6, transition: { duration: 4, ease: 'linear' } },
    exhale: { scale: 1, transition: { duration: 4, ease: 'linear' } },
    'hold-empty': { scale: 1, transition: { duration: 4, ease: 'linear' } },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-8">
      <div className="text-2xl md:text-3xl font-black text-primary text-center h-12">
        {isActive ? instruction : 'Presiona Iniciar para comenzar'}
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Background circle outline */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        
        {/* Inner animated sphere */}
        <motion.div
          animate={isActive ? phase : 'hold-empty'}
          variants={variants}
          className="w-32 h-32 rounded-full bg-primary/80 shadow-2xl flex items-center justify-center"
        />

        {/* Phase progress indicator text in the center */}
        {isActive && (
          <div className="absolute z-10 text-white font-bold text-3xl mix-blend-overlay">
            {4 - (cycleTime % 4)}
          </div>
        )}
      </div>
    </div>
  );
}
