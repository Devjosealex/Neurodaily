'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminFeedbackPage() {
  const { getToken } = useAuth();
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['admin-feedback', ratingFilter, categoryFilter, dateFrom, dateTo],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];
      const api = createApiClient(token);
      const params = new URLSearchParams();
      if (ratingFilter) {
        params.append('rating_min', ratingFilter);
        params.append('rating_max', ratingFilter);
      }
      if (categoryFilter) params.append('category', categoryFilter);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      
      return api.adminGetFeedback(params.toString()) as Promise<any[]>;
    },
  });

  const list = feedbacks;

  const exportCSV = () => {
    if (list.length === 0) return;
    const headers = ['Microacción', 'Categoría', 'Calificación', 'Comentario', 'Fecha'];
    const rows = list.map(item => [
      `"${item.microAction?.title || 'Microacción Eliminada'}"`,
      `"${item.microAction?.category || ''}"`,
      item.rating,
      `"${(item.feedback || '').replace(/"/g, '""')}"`,
      `"${format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `feedback_neurodaily_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback de Usuarios</h1>
          <p className="text-muted-foreground">Revisa las calificaciones y comentarios (anonimizados).</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCSV}
            disabled={list.length === 0}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Calificación</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
          >
            <option value="">Todas</option>
            <option value="5">5 Estrellas</option>
            <option value="4">4 Estrellas</option>
            <option value="3">3 Estrellas</option>
            <option value="2">2 Estrellas</option>
            <option value="1">1 Estrella</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Categoría</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
          >
            <option value="">Todas</option>
            <option value="breathing">Respiración</option>
            <option value="movement">Movimiento</option>
            <option value="focus">Enfoque</option>
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

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Microacción</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Calificación</th>
                <th className="px-6 py-4">Comentario</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Cargando feedback...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontró feedback para los filtros actuales.
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {item.microAction?.title || 'Microacción Eliminada'}
                    </td>
                    <td className="px-6 py-4">
                      {item.microAction?.category && (
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                          {item.microAction.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.feedback ? (
                        <span className="text-muted-foreground italic flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                          "{item.feedback}"
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">- Sin comentario -</span>
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
