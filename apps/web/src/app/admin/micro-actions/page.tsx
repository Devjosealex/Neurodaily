'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';
import { MicroActionForm } from '@/components/admin/MicroActionForm';
import { Plus, Edit2, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminMicroActionsPage() {
  const { getToken } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data: microActions = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-micro-actions-list'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];
      const api = createApiClient(token);
      return api.adminGetMicroActions();
    },
  });

  const handleToggle = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      await api.adminToggleMicroAction(id);
      refetch();
    } catch (e) {
      console.error(e);
      alert('Error al cambiar el estado');
    }
  };

  const list = microActions as any[];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microacciones</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de microacciones (CRUD).</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Microacción
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editingItem ? 'Editar Microacción' : 'Crear Nueva Microacción'}
          </h2>
          <MicroActionForm
            initialData={editingItem}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingItem(null);
              refetch();
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Duración</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Cargando microacciones...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No hay microacciones registradas.
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.duration}s</td>
                    <td className="px-6 py-4">
                      {item.isPremium ? (
                        <span className="text-yellow-600 font-semibold text-xs border border-yellow-600/30 px-2 py-1 rounded-md bg-yellow-500/10">PRO</span>
                      ) : (
                        <span className="text-green-600 font-semibold text-xs border border-green-600/30 px-2 py-1 rounded-md bg-green-500/10">FREE</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-600" /> Activa
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground" /> Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          item.isActive 
                            ? "text-red-500 hover:bg-red-500/10" 
                            : "text-green-500 hover:bg-green-500/10"
                        )}
                        title={item.isActive ? 'Desactivar' : 'Activar'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
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
