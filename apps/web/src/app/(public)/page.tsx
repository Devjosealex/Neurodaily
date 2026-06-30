import Link from 'next/link';
import type { Metadata } from 'next';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'NeuroDaily — Organiza tu día, reduce la fricción mental',
  description:
    'Un organizador diario que te ayuda a decidir qué hacer ahora, cómo empezar cuando estás bloqueado y qué microdescanso usar según tu estado.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen gradient-subtle flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
          MVP en construcción
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="text-gradient">NeuroDaily</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Un organizador diario que no solo agenda tareas, sino que te ayuda a{' '}
          <strong className="text-foreground">decidir qué hacer ahora</strong> y cómo empezar cuando estás bloqueado.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <SignedOut>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold gradient-primary text-white shadow-lg hover:opacity-90 transition-opacity"
              id="landing-cta-signup"
            >
              Empieza gratis
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold bg-white border border-border text-foreground hover:bg-muted transition-colors"
              id="landing-cta-signin"
            >
              Iniciar sesión
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold gradient-primary text-white shadow-lg hover:opacity-90 transition-opacity"
              id="landing-cta-dashboard"
            >
              Ir al Dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Social proof subtle */}
        <p className="text-sm text-muted-foreground">
          Sin tarjeta de crédito · Plan gratuito disponible
        </p>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl">{feature.emoji}</div>
            <h3 className="font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

const features = [
  {
    emoji: '🧠',
    title: '¿Qué hago ahora?',
    description:
      'Basado en tu energía, ansiedad y contexto, NeuroDaily decide la próxima acción perfecta para ti.',
  },
  {
    emoji: '⚡',
    title: 'Primer paso fácil',
    description:
      'Cuando estás bloqueado, descomponemos cualquier tarea en el primer paso mínimo que puedes hacer ahora.',
  },
  {
    emoji: '🌿',
    title: 'Microdescansos inteligentes',
    description:
      'Técnicas de recuperación cognitiva según tu estado: respiración, movimiento, mindfulness y más.',
  },
];
