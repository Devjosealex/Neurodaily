'use client';

import { useState, useEffect } from 'react';
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
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isPomodoro ? 50 * 60 : 0); // 50 min or count up
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breakInterval, setBreakInterval] = useState(90); // Default 90 min for continuous mode
  const [showAutoBreak, setShowAutoBreak] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null);
  const [recommendedSlug, setRecommendedSlug] = useState<string>('respiracion-caja');

  // Fetch task title
  useEffect(() => {
    async function loadTask() {
      try {
        const token = await getToken();
        if (!token) return;
        const api = createApiClient(token);
        const task = await api.getTask(params.id) as { title: string };
        if (task && task.title) {
          setTaskTitle(task.title);
        }
      } catch (err) {
        console.error('Failed to load task', err);
      }
    }
    loadTask();
  }, [params.id, getToken]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const nextTime = isPomodoro ? Math.max(0, time - 1) : time + 1;
          
          // Check for continuous mode auto-break
          if (!isPomodoro && nextTime > 0 && nextTime % (breakInterval * 60) === 0) {
            setIsActive(false);
            setIsPaused(true);
            setShowAutoBreak(true);
          }
          
          return nextTime;
        });
      }, 1000);
    }

    if (isPomodoro && timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsPaused(true);
      setShowAutoBreak(true);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, isPomodoro, timeLeft, breakInterval]);

  // Fetch recommendation when break hits
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
      const timeToBreak = isPomodoro ? timeLeft : (breakInterval * 60) - (timeLeft % (breakInterval * 60));
      setNextBreakTime(new Date(Date.now() + timeToBreak * 1000));
    } else {
      setIsPaused(!isPaused);
      if (!isPaused) {
        setNextBreakTime(null);
      } else {
        const timeToBreak = isPomodoro ? timeLeft : (breakInterval * 60) - (timeLeft % (breakInterval * 60));
        setNextBreakTime(new Date(Date.now() + timeToBreak * 1000));
      }
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      const token = await getToken();
      if (token) {
        const api = createApiClient(token);
        // Archivar la tarea (quitarla del daily flow)
        await api.updateTask(params.id, { dueDate: null });
      }
      setIsFinished(true);
    } catch (err) {
      console.error('Failed to update task', err);
      setIsFinished(true); // Show success anyway
    } finally {
      setIsFinishing(false);
    }
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
    <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Modo Enfoque</h1>
        <p className="text-xl text-muted-foreground">
          Trabajando en Tarea: <span className="font-semibold text-primary">{taskTitle || 'Cargando...'}</span>
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Button variant={isPomodoro ? 'outline' : 'default'} onClick={() => { setIsPomodoro(false); setTimeLeft(0); setIsActive(false); setShowAutoBreak(false); }}>
            Continuo
          </Button>
          <Button variant={isPomodoro ? 'default' : 'outline'} onClick={() => { setIsPomodoro(true); setTimeLeft(50 * 60); setIsActive(false); setShowAutoBreak(false); }}>
            Pomodoro (50m)
          </Button>
        </div>

        {!isPomodoro && !isActive && timeLeft === 0 && (
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

        {isActive && nextBreakTime && !isPaused && (
          <div className="flex flex-col items-center gap-1 mt-6 text-sm text-muted-foreground animate-in fade-in bg-muted/30 px-6 py-4 rounded-2xl border">
            <p className="font-medium text-base">Bloque de enfoque: <span className="text-foreground">{isPomodoro ? '50 min' : `${breakInterval} min`}</span></p>
            <p>Siguiente microdescanso a las: <span className="font-bold text-primary text-base">{nextBreakTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
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
              {showAutoBreak && !isPomodoro 
                ? `Has trabajado ${breakInterval} minutos continuos. NeuroDaily sugiere una microacción para recuperar energía.`
                : 'NeuroDaily sugiere una microacción para recuperar energía antes de continuar.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href={`/micro-actions/${recommendedSlug}?returnTo=/tasks/${params.id}/play`}>
                <Button className="bg-amber-500 hover:bg-amber-600 shadow-lg font-bold w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" /> Iniciar Microdescanso
                </Button>
              </Link>
              <Button variant="outline" onClick={() => { setShowAutoBreak(false); toggleTimer(); }} className="w-full sm:w-auto">
                Saltar por ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
