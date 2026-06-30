'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';

export default function TasksPage() {
  const { getToken } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];
      const api = createApiClient(token);
      return api.getTasks();
    },
  });

  const taskList = (tasks as any[]) || [];
  const activeTasks = taskList.filter((t: any) => t.status !== 'completed');
  const archivedTasks = taskList.filter((t: any) => t.status === 'completed');

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>
            <p className="text-muted-foreground">
              {activeTasks.length} {activeTasks.length === 1 ? 'activa' : 'activas'}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isCreating ? 'Cancelar' : '+ Nueva Tarea'}
          </button>
        </div>

        {isCreating && (
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <CreateTaskForm 
              onSuccess={() => {
                setIsCreating(false);
                refetch();
              }} 
            />
          </div>
        )}

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner text="Cargando tareas..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tareas Activas */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b border-border pb-2">Activas</h2>
              {activeTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">
                  No hay tareas activas.
                </p>
              ) : (
                <div className="grid gap-3">
                  {activeTasks.map((task: any) => (
                    <TaskCard key={task.id} task={task} onUpdate={refetch} />
                  ))}
                </div>
              )}
            </div>

            {/* Tareas Archivadas */}
            {archivedTasks.length > 0 && (
              <div className="space-y-4 opacity-75">
                <h2 className="text-lg font-semibold border-b border-border pb-2">Archivadas</h2>
                <div className="grid gap-3">
                  {archivedTasks.map((task: any) => (
                    <TaskCard key={task.id} task={task} onUpdate={refetch} isArchived />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
