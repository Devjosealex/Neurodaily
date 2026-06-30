'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createApiClient } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  dueDate?: string;
  startTime?: string;
  orderIndex: number;
}

// Sortable Item Component
function SortableTaskItem({ task, onRemove }: { task: Task, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const { getToken } = useAuth();
  const router = useRouter();
  const [isGeneratingStep, setIsGeneratingStep] = useState(false);
  const [visualTitle, setVisualTitle] = useState(task.title);
  const [stepMethod, setStepMethod] = useState<'rules' | 'ai' | null>(null);

  const handleFirstStep = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing mb-3 group relative flex items-center justify-between ${
        isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div>
        <div className="flex flex-col gap-0.5">
          {stepMethod === 'ai' && (
            <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Generado por IA
            </span>
          )}
          <div className={`font-bold pr-6 ${stepMethod ? 'text-amber-600' : 'text-[#3A2D58]'}`}>{visualTitle}</div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {task.estimatedMinutes && (
            <div className="text-xs text-muted-foreground">
              ⏱ {task.estimatedMinutes} min
            </div>
          )}
          {!stepMethod && (
            <button
              onClick={handleFirstStep}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={isGeneratingStep}
              className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-amber-100 transition-colors disabled:opacity-50 border border-amber-200"
              title="Pedir a la IA el primer paso para empezar sin fricción"
            >
              {isGeneratingStep ? '...' : <><Sparkles className="w-3 h-3" /> 1er Paso</>}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href={`/tasks/${task.id}/play`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-colors flex items-center"
          title="Iniciar Tarea"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        </a>

        <button
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => {
            e.stopPropagation();
            onRemove(task.id);
          }}
          className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full border shadow-sm flex items-center justify-center"
          title="Quitar de tu día"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
}

export function DailyFlowManager() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const data = await api.getTasks() as Task[];
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    let newTasks = [...tasks];
    const targetItems = newTasks.sort((a, b) => a.orderIndex - b.orderIndex);

    const oldIndex = targetItems.findIndex(t => t.id === activeId);
    const newIndex = targetItems.findIndex(t => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedTargetItems = arrayMove(targetItems, oldIndex, newIndex);
      updatedTargetItems.forEach((t, i) => t.orderIndex = i);
      newTasks = updatedTargetItems;
    }

    setTasks(newTasks);

    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      
      const itemsToUpdate = newTasks.map(t => ({
        id: t.id,
        orderIndex: t.orderIndex,
        dueDate: t.dueDate,
      }));

      await api.reorderTasks(itemsToUpdate);
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  const handleRemoveTask = async (id: string) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== id));
    
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      await api.updateTask(id, { dueDate: null });
    } catch (err) {
      console.error(err);
      fetchTasks(); // Revert on error
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando tu día...</div>;

  // Solo mostrar las tareas que hayan sido "activadas" (tienen dueDate) para el flujo de hoy
  const dailyFlowTasks = tasks.filter(t => !!t.dueDate).sort((a, b) => a.orderIndex - b.orderIndex);

  let consecutiveMinutes = 0;
  let showBreakAfterTaskId: string | null = null;
  for (const t of dailyFlowTasks) {
    if (t.estimatedMinutes) {
      consecutiveMinutes += t.estimatedMinutes;
      if (consecutiveMinutes >= 90) {
        showBreakAfterTaskId = t.id;
        consecutiveMinutes = 0;
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="max-w-3xl mx-auto min-h-[calc(100vh-12rem)]">
        
        {/* Single Daily Flow Column */}
        <div className="bg-white rounded-3xl p-6 flex flex-col h-full shadow-lg border border-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-primary">Daily Flow</h2>
              <p className="text-muted-foreground font-medium text-sm">Tu día. Mantenlo ligero y sin fricción.</p>
            </div>
            <a href="/tasks" className="bg-[#463765] text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-[#3A2D58] transition-colors">
              Gestionar Tareas
            </a>
          </div>
          
          <div className="flex-1 pr-2 relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-100 rounded-full z-0 hidden md:block"></div>
            
            <SortableContext items={dailyFlowTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="min-h-[100px] h-full pb-20 relative z-10">
                {dailyFlowTasks.map(task => (
                  <div key={task.id}>
                    <div className="flex items-center gap-4 relative">
                      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white shrink-0 shadow-sm z-10 hidden md:block" />
                      <div className="flex-1">
                        <SortableTaskItem task={task} onRemove={handleRemoveTask} />
                      </div>
                    </div>
                    
                    {/* Smart Break Suggestion */}
                    {showBreakAfterTaskId === task.id && (
                      <div className="flex items-center gap-4 my-6 pl-2 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-[#A3527D] shrink-0 shadow-md flex items-center justify-center text-white text-xl animate-bounce">
                          ✨
                        </div>
                        <div className="bg-[#FDF2F5] p-4 rounded-2xl flex-1 border border-[#F2A8B9]">
                          <h4 className="font-bold text-[#A3527D]">Sugerencia Inteligente</h4>
                          <p className="text-sm text-[#3A2D58] mt-1">Llevas +90 min de tareas. Es momento perfecto para un "Estiramiento de Cuello" rápido para liberar tensión.</p>
                          <a href="/micro-actions/estiramiento-cuello" className="inline-block mt-3 bg-[#A3527D] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#8A4569] transition-colors">
                            Ir a la Micro-acción
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {dailyFlowTasks.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-xl md:ml-8 bg-white">
                    No hay tareas para tu día.
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </div>

      </div>
    </DndContext>
  );
}
