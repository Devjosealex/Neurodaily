'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';

export function MicroActionForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [category, setCategory] = useState(initialData?.category || 'breathing');
  const [duration, setDuration] = useState(initialData?.duration || 300);
  const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      
      const api = createApiClient(token);
      const data = {
        title,
        description,
        instructions,
        category,
        duration: Number(duration),
        isPremium,
        isActive,
      };

      if (initialData?.id) {
        await api.adminUpdateMicroAction(initialData.id, data);
      } else {
        await api.adminCreateMicroAction(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <input
            required
            type="text"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoría</label>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="breathing">Respiración (breathing)</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="movement">Movimiento</option>
            <option value="focus">Foco</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Instrucciones (opcional, JSON array o texto)</label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg bg-background font-mono text-sm"
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder='["Paso 1", "Paso 2"]'
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duración (segundos)</label>
          <input
            required
            type="number"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="space-y-2 flex flex-col justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm font-medium">Contenido Premium (Pro)</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm font-medium">Activa (Pública)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg font-medium hover:bg-muted text-muted-foreground transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar Microacción'}
        </button>
      </div>
    </form>
  );
}
