'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, BrainCircuit, ListChecks } from 'lucide-react';

interface MentalDumpProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

export function MentalDump({ timeLeft, totalTime, isActive }: MentalDumpProps) {
  const elapsed = totalTime - timeLeft;

  let step = 0;
  if (!isActive && elapsed === 0) {
    step = -1; // Not started
  } else if (elapsed < 30) {
    step = 1;
  } else if (elapsed < 90) {
    step = 2;
  } else {
    step = 3;
  }

  const steps = [
    {
      title: 'Prepárate',
      instruction: 'Busca papel y lápiz (o abre una nota vacía en tu teléfono).',
      icon: BookOpen,
      duration: '30s'
    },
    {
      title: 'Vaciado Total',
      instruction: 'Escribe TODO lo que tienes en la cabeza. Sin filtros, sin orden. Solo vacía tu mente.',
      icon: BrainCircuit,
      duration: '1 min'
    },
    {
      title: 'Priorización Mínima',
      instruction: 'Revisa tu lista y subraya o marca SOLO 1 COSA. La más importante para hoy.',
      icon: ListChecks,
      duration: '30s'
    }
  ];

  const currentStepData = step > 0 ? steps[step - 1] : steps[0];
  const Icon = currentStepData.icon;

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-8 w-full max-w-2xl mx-auto">
      
      {/* Step Progress Indicators */}
      <div className="flex gap-4 w-full px-8">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="flex-1 h-2 rounded-full bg-primary/20 overflow-hidden">
            {step >= idx && (
              <motion.div 
                initial={{ width: step === idx && isActive ? '0%' : '100%' }}
                animate={{ width: step > idx ? '100%' : step === idx && isActive ? '100%' : '0%' }}
                transition={{ duration: step === idx ? (idx === 2 ? 60 : 30) : 0, ease: 'linear' }}
                className="h-full bg-primary"
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === -1 ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <BookOpen className="w-32 h-32 text-primary/50 mx-auto" strokeWidth={1} />
            <div className="text-2xl font-black text-primary">Presiona Iniciar para comenzar</div>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center space-y-8 w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
              <Icon className="w-40 h-40 text-primary relative z-10" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
                Paso {step} de 3
              </h2>
              <h3 className="text-3xl md:text-4xl font-black text-foreground">
                {currentStepData.title}
              </h3>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                {currentStepData.instruction}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
