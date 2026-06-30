'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ActivitySquare } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const fetchRecommendation = async () => {
    setLoading(true);
    // En el MVP sin DB, simulamos la respuesta del motor de reglas
    setTimeout(() => {
      setRecommendation({
        primary: {
          title: "Respiración de Caja",
          category: "breathing",
          durationSeconds: 120,
          slug: "respiracion-caja",
          reason: "Porque marcaste ansiedad alta en tu último check-in."
        },
        alternative: {
          title: "Caminata Consciente",
          category: "mindfulness",
          durationSeconds: 300,
          slug: "caminata-consciente"
        }
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">¿Qué hago ahora?</h1>
        <p className="text-xl text-muted-foreground">
          Deja que NeuroDaily decida por ti basándose en tu nivel de energía y ansiedad.
        </p>
      </div>

      {!recommendation && (
        <div className="flex justify-center pt-8">
          <Button size="lg" className="h-16 px-8 text-lg rounded-full" onClick={fetchRecommendation} disabled={loading}>
            {loading ? 'Calculando el mejor paso...' : 'Sugerir mi próxima acción'}
          </Button>
        </div>
      )}

      {recommendation && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-primary shadow-md">
            <CardHeader className="bg-primary/5 border-b">
              <CardDescription className="text-primary font-medium tracking-wide uppercase">
                Recomendación Principal
              </CardDescription>
              <CardTitle className="text-2xl">{recommendation.primary.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
                "{recommendation.primary.reason}"
              </p>
              <div className="flex justify-end pt-2">
                <Link href={`/micro-actions/${recommendation.primary.slug}`}>
                  <Button size="lg">
                    Empezar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Alternativa</CardDescription>
              <CardTitle className="text-xl">{recommendation.alternative.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{Math.floor(recommendation.alternative.durationSeconds / 60)} min</span>
              <Link href={`/micro-actions/${recommendation.alternative.slug}`}>
                <Button variant="outline">Empezar alternativa</Button>
              </Link>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Link href="/micro-actions">
              <Button variant="ghost" className="text-muted-foreground">
                <ActivitySquare className="mr-2 h-4 w-4" />
                Explorar la biblioteca por mi cuenta
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
