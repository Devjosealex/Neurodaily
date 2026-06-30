'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { createApiClient } from '@/lib/api';
import { OnboardingInput } from '@neurodaily/shared';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const STEPS = [
  { id: 'objectives', title: '¿Cuál es tu objetivo principal?' },
  { id: 'frequent_context', title: '¿Dónde sueles estar la mayor parte del día?' },
  { id: 'intensity_preference', title: '¿Qué nivel de intensidad prefieres?' },
  { id: 'timezone', title: 'Configurando tu zona horaria' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState<Partial<OnboardingInput>>({});

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 2) {
        // Auto-detect timezone on step 3 before moving to final step
        setPreferences(prev => ({
          ...prev,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }));
      }
      setCurrentStep(curr => curr + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No token');
      
      const api = createApiClient(token);
      await api.completeOnboarding(preferences);
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Error completando onboarding:', err);
      // Fallback, go to dashboard anyway for MVP
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <LoadingSpinner text="Preparando tu espacio..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Paso {currentStep + 1} de {STEPS.length}
          </p>
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border shadow-lg rounded-2xl p-6 min-h-[300px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-6">{STEPS[currentStep].title}</h2>

              {currentStep === 0 && (
                <div className="grid gap-3">
                  {['Productividad y enfoque', 'Reducir estrés y ansiedad', 'Mejorar hábitos', 'Equilibrio trabajo/vida'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setPreferences({ ...preferences, mainGoal: opt })}
                      className={`p-4 text-left rounded-xl border transition-colors ${preferences.mainGoal === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-3">
                  {[
                    { val: 'office', label: 'Oficina' },
                    { val: 'home', label: 'Casa / Home Office' },
                    { val: 'university', label: 'Universidad / Escuela' },
                    { val: 'transport', label: 'Transporte / Movimiento' },
                    { val: 'other', label: 'Variado' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setPreferences({ ...preferences, preferredContext: opt.val as any })}
                      className={`p-4 text-left rounded-xl border transition-colors ${preferences.preferredContext === opt.val ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-3">
                  {[
                    { val: 'soft', label: 'Suave (Solo lo necesario)' },
                    { val: 'balanced', label: 'Equilibrado (Default)' },
                    { val: 'demanding', label: 'Exigente (Alto rendimiento)' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setPreferences({ ...preferences, workStyle: opt.val })}
                      className={`p-4 text-left rounded-xl border transition-colors ${preferences.workStyle === opt.val ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl">
                    🌍
                  </div>
                  <p className="text-muted-foreground">
                    Hemos detectado tu zona horaria como:<br/>
                    <strong className="text-foreground">{preferences.timezone}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Todo listo para personalizar tu experiencia en NeuroDaily.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition-opacity"
            >
              Atrás
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {currentStep === STEPS.length - 1 ? 'Comenzar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
