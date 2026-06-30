'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { CheckinContext } from '@neurodaily/shared';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function CheckinPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Level 1 (Default)
  const [energyLevel, setEnergyLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState(1);
  const [currentContext, setCurrentContext] = useState<CheckinContext>('work');

  // Level 2 (Normal)
  const [sleepQuality, setSleepQuality] = useState(3);
  const [availableTime, setAvailableTime] = useState<number | null>(null);

  // Level 3 (Pro)
  const [mentalClarity, setMentalClarity] = useState(3);
  const [currentState, setCurrentState] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('No token');
      
      const api = createApiClient(token);
      
      const payload: any = {
        energyLevel,
        anxietyLevel,
        currentContext,
        checkinLevel: level,
      };

      if (level >= 2) {
        payload.sleepQuality = sleepQuality;
        if (availableTime) payload.availableTime = availableTime;
      }

      if (level === 3) {
        payload.mentalClarity = mentalClarity;
        if (currentState) payload.currentState = currentState;
      }

      await api.createCheckin(payload);
      
      // Navigate to dashboard and automatically trigger What Now?
      router.push('/dashboard?action=what-now');
    } catch (err: any) {
      console.error('Error checking in:', err);
      setError(err.message || 'Error al guardar el check-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Check-in</h1>
        <p className="text-muted-foreground">¿Cómo estás ahora mismo?</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Level Selector */}
      <div className="flex bg-muted p-1 rounded-xl">
        <button
          onClick={() => setLevel(1)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${level === 1 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          ⚡ Rápido (5s)
        </button>
        <button
          onClick={() => setLevel(2)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${level === 2 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Normal (15s)
        </button>
        <button
          onClick={() => setLevel(3)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${level === 3 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Detallado
          <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">Pro</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-8 shadow-sm">
        {/* Nivel 1 */}
        <div className="space-y-6">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
            Lo Esencial
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Energía ({energyLevel}/5)</label>
              <input 
                type="range" min="1" max="5" 
                value={energyLevel} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-primary" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Agotado</span>
                <span>A tope</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ansiedad / Estrés ({anxietyLevel}/5)</label>
              <input 
                type="range" min="1" max="5" 
                value={anxietyLevel} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnxietyLevel(Number(e.target.value))}
                className="w-full accent-primary" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Tranquilo</span>
                <span>Muy tenso</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contexto actual</label>
              <select 
                value={currentContext}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentContext(e.target.value as CheckinContext)}
                className="w-full p-2.5 rounded-xl border border-input bg-background text-sm"
              >
                <option value="work">Trabajo</option>
                <option value="study">Estudio</option>
                <option value="home">Casa</option>
                <option value="commute">Transporte</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nivel 2 */}
        {level >= 2 && (
          <div className="space-y-6 pt-6 border-t border-border animate-slide-up">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              Más Detalles
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Calidad de sueño ({sleepQuality}/5)</label>
                <input 
                  type="range" min="1" max="5" 
                  value={sleepQuality} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSleepQuality(Number(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tiempo disponible (opcional)</label>
                <select 
                  value={availableTime || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAvailableTime(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2.5 rounded-xl border border-input bg-background text-sm"
                >
                  <option value="">No sé / No aplica</option>
                  <option value="5">5 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">Media hora</option>
                  <option value="60">1 hora</option>
                  <option value="120">2+ horas</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Nivel 3 */}
        {level >= 3 && (
          <div className="space-y-6 pt-6 border-t border-border animate-slide-up">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              Profundidad Pro
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Claridad Mental ({mentalClarity}/5)</label>
                <input 
                  type="range" min="1" max="5" 
                  value={mentalClarity} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMentalClarity(Number(e.target.value))}
                  className="w-full accent-primary" 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Niebla mental</span>
                  <span>Muy claro</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estado predominante</label>
                <input 
                  type="text" 
                  placeholder="Ej: Abrumado, Motivado, Distraído..."
                  value={currentState} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-input bg-background text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Guardar Check-in'}
          </button>
        </div>
      </div>
    </div>
  );
}
