'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminRecommendationsLogsPage() {
  const { getToken } = useAuth();
  const [acceptedFilter, setAcceptedFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-recommendation-logs', acceptedFilter, typeFilter, dateFrom, dateTo],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      const api = createApiClient(token);
      const params = new URLSearchParams();
      if (acceptedFilter !== '') params.append('accepted', acceptedFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      
      return api.adminGetRecommendationLogs(params.toString()) as Promise<{
        logs: any[];
        stats: { total: number; accepted: number; acceptanceRate: number };
      }>;
    },
  });

  const list = data?.logs || [];
  const stats = data?.stats;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs del Motor IA</h1>
          <p className="text-muted-foreground">Historial de recomendaciones y tasa de éxito.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Estado</label>
          <select
            value={acceptedFilter}
            onChange={(e) => setAcceptedFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
          >
            <option value="">Todos</option>
            <option value="true">Aceptadas</option>
            <option value="false">Rechazadas</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
          >
            <option value="">Todos</option>
            <option value="micro_action">Microacción</option>
            <option value="task">Tarea</option>
            <option value="first_step">Primer Paso</option>
            <option value="rest">Descanso</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Total Recomendaciones</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <h3 className="font-semibold text-sm text-green-600">Recomendaciones Aceptadas</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold text-green-600">{stats?.accepted || 0}</div>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
          <h3 className="font-semibold text-sm text-blue-600">Tasa de Aceptación</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="text-3xl font-bold text-blue-600">
              {stats?.acceptanceRate ? `${stats.acceptanceRate.toFixed(1)}%` : '0%'}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Usuario ID</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Razón / Prompt</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Cargando logs...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron logs de recomendaciones.
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {item.userId?.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                        {item.recommendedType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground italic line-clamp-2" title={item.reason}>
                        "{item.reason}"
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.accepted === true && (
                        <span className="flex items-center gap-1.5 text-green-600 font-medium text-xs">
                          <CheckCircle className="w-4 h-4" /> Aceptado
                        </span>
                      )}
                      {item.accepted === false && (
                        <span className="flex items-center gap-1.5 text-red-500 font-medium text-xs">
                          <XCircle className="w-4 h-4" /> Rechazado
                        </span>
                      )}
                      {item.accepted === null && (
                        <span className="flex items-center gap-1.5 text-muted-foreground font-medium text-xs">
                          <Activity className="w-4 h-4" /> Ignorado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(item.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
