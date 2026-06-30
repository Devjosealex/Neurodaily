'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function MicroActionsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [actions, setActions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      
      const [actionsRes, subRes] = await Promise.all([
        api.getMicroActions(),
        api.getSubscription()
      ]);
      
      setActions(actionsRes as any[]);
      setSubscription(subRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumClick = () => {
    router.push('/settings/billing');
  };

  if (loading) {
    return <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>;
  }

  const isPro = subscription?.plan === 'pro';

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Microacciones</h1>
        <p className="text-muted-foreground">Pequeñas acciones para recuperar tu energía y enfoque.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const isLocked = action.isPremium && !isPro;

          return (
            <Card key={action.slug} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  {action.isPremium && (
                    <Lock className={`h-4 w-4 ${isPro ? 'text-primary' : 'text-amber-500'}`} />
                  )}
                </div>
                <CardDescription>{Math.floor(action.durationSeconds / 60)} min • {action.category}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLocked ? (
                  <Button onClick={handlePremiumClick} className="w-full" variant="secondary">
                    <Lock className="mr-2 h-4 w-4" /> 
                    Desbloquear Pro
                  </Button>
                ) : (
                  <Link href={`/micro-actions/${action.slug}`}>
                    <Button className="w-full" variant="default">
                      <Play className="mr-2 h-4 w-4" /> 
                      Iniciar
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
