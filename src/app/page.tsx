import { apps } from "@/lib/apps-config";
import { AppCard } from "@/components/app-card";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Visao geral dos seus apps
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {apps.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          Nenhum app configurado. Edite <code>src/lib/apps-config.ts</code>
        </p>
      )}
    </div>
  );
}
