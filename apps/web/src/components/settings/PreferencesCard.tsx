'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { Settings, Volume2, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function PreferencesCard() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      const api = createApiClient(token);
      return api.getMe();
    },
  });

  const mutation = useMutation({
    mutationFn: async (newPrefs: any) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      const api = createApiClient(token);
      return api.updatePreferences(newPrefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const userPrefs = (user as any)?.preferences || {};

  const handleToggle = (key: string, currentValue: boolean) => {
    mutation.mutate({ [key]: !currentValue });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center justify-center h-full shadow-lg border border-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-lg border border-gray-100 hover:border-[#F2A8B9] transition-all group">
      <div className="w-14 h-14 bg-[#F2A8B9]/20 text-[#A3527D] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Settings className="w-7 h-7" />
      </div>
      
      <h2 className="text-2xl font-black text-[#3A2D58] tracking-tight mb-2">Preferencias</h2>
      <p className="text-muted-foreground text-sm font-medium mb-8">
        Personaliza tu experiencia y ajusta NeuroDaily a tu estilo.
      </p>

      <div className="space-y-6">
        {/* Toggle: Hide Completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5F5EC] text-[#2F855A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#3A2D58] text-sm">Ocultar Completadas</p>
              <p className="text-xs text-muted-foreground">En la vista general de tareas.</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('hideCompletedTasks', !!userPrefs.hideCompletedTasks)}
            disabled={mutation.isPending}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              userPrefs.hideCompletedTasks ? 'bg-[#2F855A]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              userPrefs.hideCompletedTasks ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Toggle: Focus Sounds */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF5F5] text-[#C53030] flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#3A2D58] text-sm">Sonidos de Enfoque</p>
              <p className="text-xs text-muted-foreground">Efectos al completar tareas.</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('enableFocusSounds', !!userPrefs.enableFocusSounds)}
            disabled={mutation.isPending}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              userPrefs.enableFocusSounds ? 'bg-[#C53030]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              userPrefs.enableFocusSounds ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
