'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Database,
  MessageSquare,
  Activity,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminItems = [
  { href: '/admin', label: 'Resumen', icon: LayoutDashboard },
  { href: '/admin/micro-actions', label: 'Microacciones', icon: Database },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/admin/recommendations', label: 'Logs IA', icon: Activity },
  { href: '/admin/limits', label: 'Límites Plan', icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-card border-r border-border py-6 px-3 shrink-0">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/admin" id="admin-sidebar-logo">
          <span className="text-xl font-bold text-gradient">Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1" aria-label="Navegación Admin">
        {adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border mt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Volver a la App
        </Link>
      </div>
    </aside>
  );
}
