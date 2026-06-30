'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Star, Zap } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function BillingPage() {
  const { getToken } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const sub = await api.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setActionLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const res = await api.createCheckoutSession();
      if ((res as any).url) {
        window.location.href = (res as any).url;
      }
    } catch (err) {
      console.error(err);
      alert('Error al iniciar el pago.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    setActionLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const res = await api.createPortalSession();
      if ((res as any).url) {
        window.location.href = (res as any).url;
      }
    } catch (err) {
      console.error(err);
      alert('Error al abrir el portal de cliente.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>;
  }

  const isPro = subscription?.plan === 'pro';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planes y Facturación</h1>
        <p className="text-muted-foreground mt-2">Gestiona tu suscripción a NeuroDaily.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className={`border-2 ${!isPro ? 'border-primary' : 'border-border'} relative overflow-hidden`}>
          {!isPro && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              TU PLAN ACTUAL
            </div>
          )}
          <CardHeader>
            <CardTitle>Básico</CardTitle>
            <CardDescription>Para empezar a reducir tu fricción mental.</CardDescription>
            <div className="text-3xl font-bold mt-4">$0 <span className="text-sm font-normal text-muted-foreground">/mes</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Check-ins ilimitados</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Tareas ilimitadas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Microacciones básicas</li>
              <li className="flex items-center gap-2 text-muted-foreground line-through"><CheckCircle2 className="w-4 h-4 opacity-50" /> Primer Paso Inteligente (IA)</li>
              <li className="flex items-center gap-2 text-muted-foreground line-through"><CheckCircle2 className="w-4 h-4 opacity-50" /> Microacciones Premium</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              {!isPro ? 'Plan Activo' : 'Básico'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className={`border-2 ${isPro ? 'border-primary' : 'border-border'} relative overflow-hidden bg-card`}>
          {isPro && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
              <Star className="w-3 h-3" /> TU PLAN ACTUAL
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">Pro <Zap className="w-5 h-5 fill-primary" /></CardTitle>
            <CardDescription>Desbloquea el máximo potencial de tu cerebro.</CardDescription>
            <div className="text-3xl font-bold mt-4">$5 <span className="text-sm font-normal text-muted-foreground">/mes</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-primary" /> Todo lo del plan básico</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-primary" /> Primer Paso con IA dinámica</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-primary" /> Todas las Microacciones Premium</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-primary" /> Estadísticas avanzadas</li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button onClick={handlePortal} disabled={actionLoading} className="w-full">
                {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                Gestionar Suscripción
              </Button>
            ) : (
              <Button onClick={handleCheckout} disabled={actionLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                Mejorar a Pro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
