import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apps } from "@/lib/apps-config";

export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Config</h2>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Apps registrados</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{apps.length} app(s) configurado(s)</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {apps.map((app) => (
                <li key={app.id}>
                  {app.icon} {app.name} — <code className="text-xs">{app.id}</code>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Variaveis de ambiente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <EnvStatus name="SENTRY_AUTH_TOKEN" set={!!process.env.SENTRY_AUTH_TOKEN} />
            <EnvStatus name="RENDER_API_KEY" set={!!process.env.RENDER_API_KEY} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Como adicionar um app</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Edite <code>src/lib/apps-config.ts</code> e adicione um novo objeto no
              array <code>apps</code> com as URLs de health check, IDs do Render e config
              do Sentry.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EnvStatus({ name, set }: { name: string; set: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <code className="text-xs">{name}</code>
      <span className={`text-xs font-medium ${set ? "text-emerald-400" : "text-muted-foreground"}`}>
        {set ? "Configurado" : "Nao configurado"}
      </span>
    </div>
  );
}
