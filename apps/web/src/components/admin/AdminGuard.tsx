'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { createApiClient } from '@/lib/api';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (!isLoaded) return;
      if (!userId) {
        router.push('/sign-in');
        return;
      }

      try {
        const token = await getToken();
        if (!token) {
          router.push('/sign-in');
          return;
        }

        const api = createApiClient(token);
        // Usamos una llamada genérica al perfil del usuario
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_BASE}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const userData = await res.json();
        
        if (userData.role === 'admin') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          console.error('Role not admin:', userData.role);
        }
      } catch (error: any) {
        console.error('Error verifying admin status:', error);
        setIsAuthorized(false);
      }
    }

    checkRole();
  }, [isLoaded, userId, getToken, router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-destructive/10 text-destructive p-6 rounded-xl max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold">Acceso Denegado</h2>
          <p>No pudimos verificar tus permisos de administrador.</p>
          <p className="text-sm opacity-80">Revisa la consola del navegador (F12) para ver el error exacto.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-background border border-destructive rounded-lg font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors mt-4"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
