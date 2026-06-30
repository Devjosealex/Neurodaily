'use client';

import { DailyFlowManager } from '@/components/dashboard/DailyFlowManager';

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FDF2F5] -m-6 p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[#3A2D58] tracking-tight">Tu día</h1>
          <p className="text-[#A3527D] font-bold text-lg mt-1">Organiza tu flujo diario</p>
        </div>
      </div>

      {/* Daily Flow Manager with DnD */}
      <DailyFlowManager />
    </div>
  );
}
