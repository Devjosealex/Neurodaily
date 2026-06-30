'use client';

import { UserButton } from '@clerk/nextjs';
import { Bell, Flame } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    name: string | null;
    email?: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const firstName = user.name?.split(' ')[0] ?? 'Usuario';

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      {/* Greeting */}
      <div>
        <p className="text-sm font-medium text-foreground">
          Hola, <span className="text-primary">{firstName}</span> 👋
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Streak placeholder */}
        <div
          id="header-streak"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground"
          title="Racha de días"
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>0</span>
        </div>

        {/* Notifications placeholder */}
        <button
          id="header-notifications"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Clerk user button */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-9 h-9',
            },
          }}
        />
      </div>
    </header>
  );
}
