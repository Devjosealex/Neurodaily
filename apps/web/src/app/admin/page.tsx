'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Database, Activity, Star, MessageSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  const { getToken } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      const api = createApiClient(token);
      return api.adminGetDashboardStats() as Promise<{
        activeMicroActions: number;
        inactiveMicroActions: number;
        recentFeedbackCount: number;
        topRated: any[];
        bottomRated: any[];
      }>;
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Resumen</h2>
        <p className="text-muted-foreground">Estadísticas generales de la plataforma.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Microacciones</h3>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold">{(stats?.activeMicroActions || 0) + (stats?.inactiveMicroActions || 0)}</div>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-green-600">
            <Activity className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Activas</h3>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold text-green-600">{stats?.activeMicroActions || 0}</div>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Inactivas</h3>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold">{stats?.inactiveMicroActions || 0}</div>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Feedback (7d)</h3>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold text-blue-600">{stats?.recentFeedbackCount || 0}</div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-4 text-green-600">
            <Star className="w-5 h-5" /> Top 5 Mejor Calificadas
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="h-20 bg-muted animate-pulse rounded-md" />
            ) : stats?.topRated && stats.topRated.length > 0 ? (
              stats.topRated.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium truncate mr-4">{item.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {item.avgRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-xs">({item.totalRatings})</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay suficientes datos de feedback.</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-4 text-red-500">
            <Star className="w-5 h-5" /> Top 5 Peor Calificadas
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="h-20 bg-muted animate-pulse rounded-md" />
            ) : stats?.bottomRated && stats.bottomRated.length > 0 ? (
              stats.bottomRated.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium truncate mr-4">{item.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-red-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {item.avgRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-xs">({item.totalRatings})</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay suficientes datos de feedback.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
