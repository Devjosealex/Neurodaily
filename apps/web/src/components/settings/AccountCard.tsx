'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { User, LogOut, Shield } from 'lucide-react';

import { useRouter } from 'next/navigation';

export function AccountCard() {
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-lg border border-gray-100 hover:border-[#97B9D1] transition-all group">
      <div className="w-14 h-14 bg-[#97B9D1]/20 text-[#6C79A7] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <User className="w-7 h-7" />
      </div>
      
      <h2 className="text-2xl font-black text-[#3A2D58] tracking-tight mb-2">Tu Cuenta</h2>
      <p className="text-muted-foreground text-sm font-medium mb-6 flex-1">
        Gestiona tu correo electrónico, contraseña, y dispositivos conectados.
      </p>

      {user && (
        <div className="bg-[#F8FAFC] p-4 rounded-xl mb-6 flex items-center gap-3">
          <img src={user.imageUrl} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#3A2D58] truncate">{user.fullName || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      )}

      <div className="space-y-3 mt-auto">
        <button
          onClick={() => openUserProfile()}
          className="w-full flex items-center justify-center gap-2 bg-[#97B9D1] hover:bg-[#7FA5C0] text-white px-6 py-3 rounded-full font-bold transition-colors shadow-sm"
        >
          <Shield className="w-4 h-4" />
          Gestionar Cuenta
        </button>
        
        <button
          onClick={async () => { 
            await signOut(); 
            router.push('/'); 
          }}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
