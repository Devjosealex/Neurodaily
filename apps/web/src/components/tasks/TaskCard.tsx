'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createApiClient, ApiError } from '@/lib/api';
import { Check, Clock, BrainCircuit, Sparkles, Play, Lock, ArchiveRestore, Archive, Edit2, Trash2 } from 'lucide-react';
import { Task } from '@neurodaily/shared';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { TaskForm } from './TaskForm';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  isArchived?: boolean;
}

const loadColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const loadLabels: Record<string, string> = {
  low: 'Baja carga',
  medium: 'Carga media',
  high: 'Alta carga',
};

export function TaskCard({ task, onUpdate, isArchived = false }: TaskCardProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingStep, setIsGeneratingStep] = useState(false);
  const [visualTitle, setVisualTitle] = useState(task.title);
  const [stepMethod, setStepMethod] = useState<'rules' | 'ai' | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleStatus = async () => {
    setIsUpdating(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      await api.updateTask(task.id, {
        status: isArchived ? 'pending' : 'completed', // We still use 'completed' in DB as the archived state
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    
    setIsUpdating(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      await api.deleteTask(task.id);
      onUpdate();
    } catch (err) {
      console.error(err);
      setIsUpdating(false);
    }
  };

  const handleFirstStep = async () => {
    setIsGeneratingStep(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const res = await api.generateFirstStep({ taskId: task.id, text: task.title }) as { step: string; method: string };
      
      setVisualTitle(res.step);
      setStepMethod(res.method as 'ai' | 'rules');
    } catch (err: any) {
      if (err.status === 403) {
        if (window.confirm('Has agotado tus usos gratuitos de la IA. ¿Quieres mejorar a Pro para desbloquear usos ilimitados?')) {
          router.push('/settings/billing');
        }
      } else {
        alert('Hubo un error al generar el primer paso.');
        console.error(err);
      }
    } finally {
      setIsGeneratingStep(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`p-6 rounded-xl border bg-card transition-all ${isArchived ? 'opacity-60 border-border/50' : 'border-border shadow-sm'}`}>
        <TaskForm 
          initialData={task} 
          onSuccess={() => { setIsEditing(false); onUpdate(); }} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border bg-card transition-all flex gap-4 ${isArchived ? 'opacity-60 border-border/50' : 'border-border hover:shadow-sm'}`}>
      {/* Archive button */}
      <button
        onClick={toggleStatus}
        disabled={isUpdating}
        title={isArchived ? "Desarchivar tarea" : "Archivar tarea"}
        className={`shrink-0 w-8 h-8 mt-0.5 rounded-md border flex items-center justify-center transition-colors ${
          isArchived ? 'bg-secondary border-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-input hover:border-primary text-muted-foreground hover:text-primary'
        }`}
      >
        {isUpdating ? <LoadingSpinner size="sm" /> : isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1 pr-14 relative">
          <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
            <button onClick={() => setIsEditing(true)} className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors" title="Editar tarea">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Eliminar tarea">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {stepMethod === 'ai' && (
            <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Generado por IA
            </span>
          )}
          <h3 className={`font-semibold text-foreground truncate ${stepMethod ? 'text-amber-600 dark:text-amber-400' : ''}`}>
            {visualTitle}
          </h3>
        </div>
        
        {task.description && !stepMethod && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${loadColors[task.cognitiveLoad] || loadColors.medium}`}>
            <BrainCircuit className="w-3 h-3" />
            {loadLabels[task.cognitiveLoad] || 'Media'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs font-medium uppercase tracking-wider">
            {task.category}
          </span>
          {task.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock className="w-3 h-3" />
              {task.estimatedMinutes} min
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {!isArchived && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-border/50 flex-wrap">
            <button
              onClick={async () => {
                setIsUpdating(true);
                try {
                  const token = await getToken();
                  if (!token) return;
                  const api = createApiClient(token);
                  await api.updateTask(task.id, {
                    dueDate: task.dueDate ? null : new Date().toISOString(),
                  });
                  onUpdate();
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsUpdating(false);
                }
              }}
              disabled={isUpdating}
              className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 ${
                task.dueDate 
                  ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                  : 'text-muted-foreground bg-secondary hover:bg-secondary/80'
              }`}
            >
              {isUpdating ? (
                <LoadingSpinner size="sm" className="mr-1" />
              ) : task.dueDate ? (
                <span className="mr-1 font-bold">✓</span>
              ) : (
                <span className="mr-1 font-bold">+</span>
              )}
              {task.dueDate ? 'En Tu Día' : 'Añadir a Tu Día'}
            </button>
            {!stepMethod && (
              <button
                onClick={handleFirstStep}
                disabled={isGeneratingStep}
                className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                {isGeneratingStep ? <LoadingSpinner size="sm" className="mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                Pedir Primer Paso
              </button>
            )}
            <a
              href={`/tasks/${task.id}/play`}
              className="inline-flex items-center text-xs font-medium text-[#A3527D] hover:text-[#3A2D58] bg-[#FDF2F5] hover:bg-[#F2A8B9] px-3 py-1.5 rounded-md transition-colors ml-auto"
            >
              <Play className="w-3 h-3 mr-1" />
              Modo Enfoque
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
