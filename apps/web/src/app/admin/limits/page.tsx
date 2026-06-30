import { Info } from 'lucide-react';

export default function AdminLimitsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Límites por Plan</h1>
        <p className="text-muted-foreground">Consulta de las restricciones configuradas (Solo lectura en MVP).</p>
      </div>

      <div className="bg-blue-50/50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start gap-3 text-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          En la fase MVP, los límites de los planes (Free vs Pro) están definidos a nivel de código (`packages/shared/src/constants/index.ts`) para garantizar la estabilidad del sistema. Modificar estos valores dinámicamente será una funcionalidad de versiones posteriores.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Característica (Feature)</th>
                <th className="px-6 py-4">Plan Free</th>
                <th className="px-6 py-4">Plan Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Tareas Activas</td>
                <td className="px-6 py-4">Máx. 5</td>
                <td className="px-6 py-4 text-green-600 font-medium">Ilimitadas</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Check-ins Diarios</td>
                <td className="px-6 py-4">1 al día</td>
                <td className="px-6 py-4 text-green-600 font-medium">Ilimitados (Re-check)</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Botón "¿Qué hago ahora?"</td>
                <td className="px-6 py-4">3 al día</td>
                <td className="px-6 py-4 text-green-600 font-medium">Ilimitado</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Modo Primer Paso (IA)</td>
                <td className="px-6 py-4">3 al día</td>
                <td className="px-6 py-4 text-green-600 font-medium">Ilimitado</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">"Dame algo más fácil"</td>
                <td className="px-6 py-4">1 nivel</td>
                <td className="px-6 py-4 text-green-600 font-medium">4 niveles</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Catálogo de Microacciones</td>
                <td className="px-6 py-4">Respiración + 2 aleatorias</td>
                <td className="px-6 py-4 text-green-600 font-medium">Acceso Total</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Historial Retenido</td>
                <td className="px-6 py-4">7 días</td>
                <td className="px-6 py-4 text-green-600 font-medium">90 días</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Modo "No quiero pensar"</td>
                <td className="px-6 py-4">1 al día</td>
                <td className="px-6 py-4 text-green-600 font-medium">Ilimitado</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Categorías de Tareas</td>
                <td className="px-6 py-4">Máx. 3</td>
                <td className="px-6 py-4 text-green-600 font-medium">Ilimitadas</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Estadísticas Semanales</td>
                <td className="px-6 py-4 text-muted-foreground/50">No disponible</td>
                <td className="px-6 py-4 text-green-600 font-medium">Incluido</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Exportar Datos</td>
                <td className="px-6 py-4 text-muted-foreground/50">No disponible</td>
                <td className="px-6 py-4 text-green-600 font-medium">Incluido</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
