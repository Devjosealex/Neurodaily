import { Metadata } from 'next';
import { AccountCard } from '@/components/settings/AccountCard';
import { PreferencesCard } from '@/components/settings/PreferencesCard';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Configuración | NeuroDaily',
  description: 'Gestiona tu cuenta y preferencias en NeuroDaily',
};

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto animate-slide-up pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#3A2D58] tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Ajusta tu cuenta, preferencias y facturación en un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Settings */}
        <div className="lg:col-span-1">
          <AccountCard />
        </div>

        {/* Preferences */}
        <div className="lg:col-span-1">
          <PreferencesCard />
        </div>

        {/* Billing/Subscription */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#A4B3D6] to-[#6C79A7] rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-lg border-none text-white hover:scale-[1.02] transition-transform">
            <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-black tracking-tight mb-2">NeuroDaily Pro</h2>
            <p className="text-white/80 text-sm font-medium mb-8">
              Lleva tu productividad al máximo nivel con características premium exclusivas impulsadas por IA.
            </p>

            <div className="mt-auto">
              <Link
                href="/settings/billing"
                className="w-full inline-flex items-center justify-center bg-white text-[#523F77] hover:bg-gray-50 px-6 py-3 rounded-full font-bold transition-colors shadow-sm"
              >
                Gestionar Suscripción
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
