'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Coffee, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TaskTimerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getToken } = useAuth();
  
  // States
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [breakInterval, setBreakInterval] = useState(90); // Default 90 min for continuous mode
  
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); 
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showAutoBreak, setShowAutoBreak] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null);
  const [recommendedSlug, setRecommendedSlug] = useState<string>('respiracion-caja');

  // Load blockIndex from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`task-${params.id}-blockIndex`);
    if (saved) setCurrentBlockIndex(parseInt(saved, 10));
  }, [params.id]);

  useEffect(() => {
    sessionStorage.setItem(`task-${params.id}-blockIndex`, currentBlockIndex.toString());
  }, [currentBlockIndex, params.id]);

  // Calculate Blocks
  const blocks = useMemo(() => {
    if (!estimatedMinutes) return [];
    const interval = isPomodoro ? 50 : breakInterval;
    const result: number[] = [];
    let remaining = estimatedMinutes;
    while (remaining > 0) {
      if (remaining > interval) {
        result.push(interval);
        remaining -= interval;
      } else {
        result.push(remaining);
        remaining = 0;
      }
    }
    return result;
  }, [estimatedMinutes, isPomodoro, breakInterval]);

  const hasBlocks = blocks.length > 0;
  const isCountdown = isPomodoro || hasBlocks;

  // Set initial time left based on mode/blocks
  useEffect(() => {
    if (hasBlocks && currentBlockIndex < blocks.length) {
      setTimeLeft(blocks[currentBlockIndex] * 60);
    } else if (!hasBlocks) {
      setTimeLeft(isPomodoro ? 50 * 60 : 0);
    }
  }, [blocks, currentBlockIndex, isPomodoro, hasBlocks]);

  // Fetch task
  useEffect(() => {
    async function loadTask() {
      try {
        const token = await getToken();
        if (!token) return;
        const api = createApiClient(token);
        const task = await api.getTask(params.id) as { title: string, estimatedMinutes?: number };
        if (task && task.title) {
          setTaskTitle(task.title);
          if (task.estimatedMinutes) setEstimatedMinutes(task.estimatedMinutes);
        }
      } catch (err) {
        console.error('Failed to load task', err);
      }
    }
    loadTask();
  }, [params.id, getToken]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const nextTime = isCountdown ? Math.max(0, time - 1) : time + 1;
          
          if (!isCountdown && nextTime > 0 && nextTime % (breakInterval * 60) === 0) {
            setIsActive(false);
            setIsPaused(true);
            setShowAutoBreak(true);
          }
          
          return nextTime;
        });
      }, 1000);
    }

    if (isCountdown && timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsPaused(true);
      setShowAutoBreak(true);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, isCountdown, timeLeft, breakInterval]);

  // Fetch recommendation
  useEffect(() => {
    if (showAutoBreak) {
      async function loadRec() {
        try {
          const token = await getToken();
          if (!token) return;
          const api = createApiClient(token);
          const rec = await api.getRecommendation('focus') as any;
          if (rec && rec.slug) {
            setRecommendedSlug(rec.slug);
          }
        } catch (e) {
          console.error(e);
        }
      }
      loadRec();
    }
  }, [showAutoBreak, getToken]);

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      const timeToBreak = isCountdown ? timeLeft : (breakInterval * 60) - (timeLeft % (breakInterval * 60));
      setNextBreakTime(new Date(Date.now() + timeToBreak * 1000));
    } else {
      setIsPaused(!isPaused);
      if (!isPaused) {
        setNextBreakTime(null);
      } else {
        const timeToBreak = isCountdown ? timeLeft : (breakInterval * 60) - (timeLeft % (breakInterval * 60));
        setNextBreakTime(new Date(Date.now() + timeToBreak * 1000));
      }
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      const token = await getToken();
      if (token) {
        const api = createApiClient(token);
        await api.updateTask(params.id, { dueDate: null, status: 'completed' });
      }
      setIsFinished(true);
    } catch (err) {
      console.error('Failed to update task', err);
      setIsFinished(true); 
    } finally {
      setIsFinishing(false);
      sessionStorage.removeItem(`task-${params.id}-blockIndex`);
    }
  };

  const handleSkipBreak = () => {
    setShowAutoBreak(false);
    if (hasBlocks && currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex(i => i + 1);
    } else if (hasBlocks && currentBlockIndex >= blocks.length - 1) {
      handleFinish();
      return;
    }
    
    setIsActive(true);
    setIsPaused(false);
    
    setTimeout(() => {
      let timeToBreak = 0;
      if (hasBlocks) timeToBreak = blocks[currentBlockIndex + 1] * 60; 
      else timeToBreak = isPomodoro ? 50 * 60 : breakInterval * 60;
      setNextBreakTime(new Date(Date.now() + timeToBreak * 1000));
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-slide-up">
        <CheckCircle2 className="h-24 w-24 text-primary mb-4" />
        <h2 className="text-4xl font-black text-foreground">¡Tarea completada!</h2>
        <p className="text-muted-foreground text-center text-lg max-w-md">
          Has marcado la tarea <span className="font-semibold text-primary">"{taskTitle}"</span> como terminada. ¡Gran trabajo!
        </p>
        <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-primary shadow-lg hover:-translate-y-1 transition-all" onClick={() => router.push('/dashboard')}>
          Ir a la siguiente tarea del Daily Flow
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh] space-y-12 px-4">
      <div className="text-center space-y-4 w-full">
        <h1 className="text-3xl font-bold">Modo Enfoque</h1>
        <p className="text-xl text-muted-foreground">
          Trabajando en Tarea: <span className="font-semibold text-primary">{taskTitle || 'Cargando...'}</span>
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Button variant={isPomodoro ? 'outline' : 'default'} onClick={() => { setIsPomodoro(false); setCurrentBlockIndex(0); setIsActive(false); setShowAutoBreak(false); }}>
            Continuo
          </Button>
          <Button variant={isPomodoro ? 'default' : 'outline'} onClick={() => { setIsPomodoro(true); setCurrentBlockIndex(0); setIsActive(false); setShowAutoBreak(false); }}>
            Pomodoro (50m)
          </Button>
        </div>

        {!isPomodoro && !isActive && timeLeft === 0 && !hasBlocks && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground animate-in fade-in">
            <span>Sugerir pausa cada:</span>
            {[60, 90, 120].map(mins => (
              <button 
                key={mins}
                onClick={() => setBreakInterval(mins)}
                className={`px-3 py-1 rounded-full border transition-colors ${breakInterval === mins ? 'bg-primary text-primary-foreground border-primary font-bold' : 'hover:bg-muted'}`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        {/* Timeline View */}
        {hasBlocks ? (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 animate-in fade-in bg-card p-4 rounded-xl border w-full max-w-2xl mx-auto shadow-sm">
            {blocks.map((duration, i) => (
              <div key={i} className="flex items-center gap-2 mb-2 sm:mb-0">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  i === currentBlockIndex 
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                    : i < currentBlockIndex 
                      ? 'bg-muted text-muted-foreground border-muted line-through opacity-70' 
                      : 'bg-background text-muted-foreground border-border'
                }`}>
                  Bloque {i + 1} ({duration}m)
                </div>
                {i < blocks.length - 1 && (
                  <div className={`flex items-center text-xs font-bold gap-1 ${i < currentBlockIndex ? 'text-muted-foreground opacity-70' : 'text-amber-500'}`}>
                    <Coffee className="w-3 h-3" />
                    <span className="hidden sm:inline">descanso</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground mt-4 animate-in fade-in">
            Tiempo indefinido. Añade una estimación a la tarea para ver el plan de descansos.
          </div>
        )}

        {isActive && nextBreakTime && !isPaused && (
          <div className="flex flex-col items-center gap-1 mt-6 text-sm text-muted-foreground animate-in fade-in bg-muted/30 px-6 py-4 rounded-2xl border max-w-xs mx-auto">
            <p className="font-medium text-base">Siguiente microdescanso a las:</p>
            <p className="font-bold text-primary text-xl">{nextBreakTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        )}
      </div>

      <div className="text-7xl font-mono font-bold tracking-tighter py-8">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4">
        <Button size="lg" className="rounded-full h-16 w-32 text-lg" onClick={toggleTimer}>
          {!isActive || isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />}
          {!isActive ? 'Iniciar' : isPaused ? 'Reanudar' : 'Pausar'}
        </Button>

        <Button 
          size="lg" 
          variant="secondary" 
          className="rounded-full h-16 w-32 text-lg" 
          onClick={handleFinish}
          disabled={isFinishing}
        >
          <CheckCircle2 className="mr-2" /> {isFinishing ? 'Guardando...' : 'Terminar'}
        </Button>
      </div>

      {(isPaused || showAutoBreak) && (
        <Card className="w-full max-w-md border-amber-500/50 bg-amber-500/5 animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="pt-6 space-y-4 text-center">
            <Coffee className="h-12 w-12 text-amber-500 mx-auto" />
            <h3 className="text-xl font-semibold">Momento de una pausa</h3>
            <p className="text-muted-foreground">
              {showAutoBreak && hasBlocks && currentBlockIndex >= blocks.length - 1
                ? '¡Has completado todos los bloques de esta tarea!'
                : 'NeuroDaily sugiere una microacción para recuperar energía antes de continuar con el siguiente bloque.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              {!(showAutoBreak && hasBlocks && currentBlockIndex >= blocks.length - 1) && (
                <Link 
                  href={`/micro-actions/${recommendedSlug}?returnTo=/tasks/${params.id}/play`}
                  onClick={() => {
                    if (hasBlocks && currentBlockIndex < blocks.length - 1) {
                      sessionStorage.setItem(`task-${params.id}-blockIndex`, (currentBlockIndex + 1).toString());
                    }
                  }}
                >
                  <Button className="bg-amber-500 hover:bg-amber-600 shadow-lg font-bold w-full sm:w-auto">
                    <Play className="mr-2 h-4 w-4" /> Iniciar Microdescanso
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleSkipBreak} className="w-full sm:w-auto">
                {showAutoBreak && hasBlocks && currentBlockIndex >= blocks.length - 1 ? 'Finalizar Tarea' : 'Saltar por ahora'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
