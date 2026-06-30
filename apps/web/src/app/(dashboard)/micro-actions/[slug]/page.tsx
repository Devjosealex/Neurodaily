'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play, Pause, CheckCircle2 } from 'lucide-react';
import { BoxBreathing } from '@/components/micro-actions/BoxBreathing';
import { NeckStretch } from '@/components/micro-actions/NeckStretch';
import { MentalDump } from '@/components/micro-actions/MentalDump';

export default function MicroActionPlayer({ params }: { params: { slug: string } }) {
  const router = useRouter();

  // Dynamic time based on slug
  const TOTAL_TIME = params.slug === 'estiramiento-cuello' ? 180 : 120;

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      // Here we would trigger POST /focus-sessions/:id/feedback
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-slide-up">
        <CheckCircle2 className="h-24 w-24 text-primary mb-4" />
        <h2 className="text-3xl font-black text-foreground">¡Microacción completada!</h2>
        <p className="text-muted-foreground text-center max-w-md text-lg">
          ¿Cómo te sientes después de esto? (Aquí iría el modal de feedback del MVP)
        </p>
        <div className="flex space-x-4 pt-4">
          <Button variant="outline" size="lg" className="rounded-full" onClick={() => router.push('/micro-actions')}>
            Volver a la Biblioteca
          </Button>
          <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/dashboard')}>
            Continuar mi día
          </Button>
        </div>
      </div>
    );
  }

  const renderAnimation = () => {
    switch (params.slug) {
      case 'respiracion-caja':
        return <BoxBreathing timeLeft={timeLeft} totalTime={TOTAL_TIME} isActive={isActive} />;
      case 'estiramiento-cuello':
        return <NeckStretch timeLeft={timeLeft} totalTime={TOTAL_TIME} isActive={isActive} />;
      case 'braindump':
        return <MentalDump timeLeft={timeLeft} totalTime={TOTAL_TIME} isActive={isActive} />;
      default:
        return (
          <div className="relative flex items-center justify-center py-12">
            <svg className="transform -rotate-90 w-64 h-64">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={120 * 2 * Math.PI}
                strokeDashoffset={120 * 2 * Math.PI * (1 - timeLeft / TOTAL_TIME)}
                className="text-primary transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute text-5xl font-black text-foreground tracking-tighter">
              {formatTime(timeLeft)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-slide-up">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight capitalize text-foreground">
          {params.slug.replace(/-/g, ' ')}
        </h1>
        {params.slug !== 'braindump' && (
          <p className="text-xl text-muted-foreground font-medium">Sigue las instrucciones visuales.</p>
        )}
      </div>

      {renderAnimation()}

      <div className="flex space-x-4">
        <Button size="lg" onClick={toggleTimer} className="w-40 rounded-full h-14 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:-translate-y-1 transition-all">
          {isActive ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
          {isActive ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button size="lg" variant="outline" onClick={() => { setTimeLeft(TOTAL_TIME); setIsActive(false); }} className="rounded-full h-14 w-40 font-bold border-2 hover:bg-muted transition-all">
          Reiniciar
        </Button>
      </div>
    </div>
  );
}
