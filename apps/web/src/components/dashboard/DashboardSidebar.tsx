'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api';
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  Sparkles,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tareas', icon: CheckSquare },
  { href: '/micro-actions', label: 'Microacciones', icon: Zap },
  { href: '/recommendations', label: 'Recomendaciones', icon: Sparkles },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

const adminItems = [
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { getToken } = useAuth();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      const api = createApiClient(token);
      return api.getMe();
    },
  });

  const isAdmin = (user as any)?.role === 'admin';

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#523F77] py-8 px-4 shrink-0 text-[#D0C9E3] overflow-y-auto">
      {/* Logo */}
      <div className="px-3 mb-10">
        <Link href="/dashboard" id="sidebar-logo">
          <span className="text-2xl font-black text-[#A4B3D6] tracking-wider uppercase">NeuroDaily</span>
        </Link>
      </div>

      <div className="px-3 mb-2 text-xs font-bold tracking-widest text-[#9A8FB3] uppercase">
        Menú Principal
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 mb-8" aria-label="Navegación principal">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`sidebar-nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
                isActive
                  ? 'bg-[#B35A8A] text-white shadow-sm'
                  : 'hover:text-white hover:bg-white/10',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <div className="pt-6 border-t border-white/10 mt-4 space-y-2">
          <div className="px-3 mb-4 text-xs font-bold tracking-widest text-[#9A8FB3] uppercase">
            Sistema
          </div>
          {adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                id="sidebar-nav-admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:text-white hover:bg-white/10 transition-all"
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </aside>
  );
}
