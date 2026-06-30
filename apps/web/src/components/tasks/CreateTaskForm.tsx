'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { CreateTaskSchema, CognitiveLoad } from '@neurodaily/shared';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function CreateTaskForm({ onSuccess }: { onSuccess: () => void }) {
  const { getToken } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoad>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const minutes = estimatedMinutes ? parseInt(estimatedMinutes) : null;
      
      const payload = {
        title,
        description: description || null,
        category,
        cognitiveLoad,
        estimatedMinutes: minutes,
      };

      // Validar con Zod en cliente
      CreateTaskSchema.parse(payload);

      const token = await getToken();
      if (!token) throw new Error('No token');
      
      const api = createApiClient(token);
      const res = await api.createTask(payload);
      
      if ((res as any).isVague) {
        // En una iteración real, esto abriría un modal para sugerir First Step
        window.alert('NeuroDaily: Esta tarea es un poco vaga. Te sugerimos descomponerla más tarde usando "Primer Paso".');
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        setError('Por favor revisa los campos.'); // Error de Zod
      } else {
        setError(err.message || 'Error al crear la tarea. Revisa tus límites Free.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input 
          type="text" 
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Ej. Redactar reporte mensual"
          className="w-full p-2.5 rounded-xl border border-input bg-background"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Carga Cognitiva</label>
        <div className="flex gap-2">
          {['low', 'medium', 'high'].map(load => (
            <button
              key={load}
              type="button"
              onClick={() => setCognitiveLoad(load as CognitiveLoad)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                cognitiveLoad === load 
                ? (load === 'low' ? 'bg-green-100 border-green-300 text-green-800' : load === 'medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-red-100 border-red-300 text-red-800')
                : 'border-input text-muted-foreground hover:bg-muted'
              }`}
            >
              {load === 'low' ? 'Baja' : load === 'medium' ? 'Media' : 'Alta'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select 
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-input bg-background text-sm"
          >
            <option value="work">Trabajo</option>
            <option value="study">Estudio</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tiempo (min)</label>
          <input 
            type="number" 
            value={estimatedMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEstimatedMinutes(e.target.value)}
            placeholder="Opcional"
            className="w-full p-2.5 rounded-xl border border-input bg-background text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title}
        className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Crear Tarea'}
      </button>
    </form>
  );
}
