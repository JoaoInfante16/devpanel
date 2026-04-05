"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apps } from "@/lib/apps-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import type { SentryIssueSummary } from "@/lib/api/sentry";
import type { HealthResult } from "@/lib/api/health";
import type { RenderDeploy } from "@/lib/api/render";
import type { AppMetrics } from "@/lib/api/app-metrics";

function usd(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace(".", ",");
}

interface DetailData {
  health: HealthResult | null;
  issues: SentryIssueSummary[];
  deploy: RenderDeploy | null;
  metrics: AppMetrics | null;
}

export default function AppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const app = apps.find((a) => a.id === appId);
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const fixedCosts = app?.fixedCosts || [];
  const fixedTotal = fixedCosts.reduce((s, c) => s + c.cost, 0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/app-detail/${appId}`);
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [appId]);

  if (!app) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">App nao encontrado</p>
        <Link href="/" className="text-primary underline text-sm mt-2 inline-block">
          Voltar
        </Link>
      </div>
    );
  }

  const apiCost = data?.metrics?.costThisMonth ?? 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          &larr; Dashboard
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-2xl">{app.icon}</span>
        <h2 className="text-2xl font-bold">{app.name}</h2>
        {data?.health && <StatusBadge status={data.health.status} />}
        {loading && <StatusBadge status="loading" />}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="errors">
            Erros
            {data?.issues && data.issues.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5">
                {data.issues.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="metrics">Metricas</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Status"
              value={data?.health?.status === "online" ? "Online" : loading ? "..." : "Offline"}
              color={data?.health?.status === "online" ? "text-emerald-400" : "text-destructive"}
            />
            <StatCard
              title="Latencia"
              value={data?.health?.latencyMs ? `${data.health.latencyMs}ms` : "—"}
            />
            <StatCard
              title="Erros 24h"
              value={data?.issues ? String(data.issues.reduce((s, i) => s + i.count, 0)) : "—"}
              color={data?.issues?.some((i) => i.count > 0) ? "text-destructive" : undefined}
            />
            <StatCard
              title="Custo este mes"
              value={`$${usd(apiCost + fixedTotal)}`}
            />
          </div>

          {data?.deploy && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ultimo Deploy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>Status: <span className="font-medium text-foreground">{data.deploy.status}</span></p>
                {data.deploy.commit && (
                  <p>Commit: <span className="font-mono text-xs">{data.deploy.commit.message}</span></p>
                )}
                <p>Data: {formatDate(data.deploy.createdAt)}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ERRORS */}
        <TabsContent value="errors">
          {(!data?.issues || data.issues.length === 0) ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhum erro nas ultimas 24h
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.issues.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {issue.culprit}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={issue.level === "error" ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {issue.level}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issue.count}x &middot; {timeAgo(issue.lastSeen)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* METRICS */}
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Noticias salvas"
              value={data?.metrics?.totalNews ? String(data.metrics.totalNews) : "—"}
            />
            <StatCard
              title="Scans realizados"
              value={data?.metrics?.totalScans ? String(data.metrics.totalScans) : "—"}
            />
            <StatCard
              title="Cidades ativas"
              value={data?.metrics?.activeLocations ? String(data.metrics.activeLocations) : "—"}
            />
            <StatCard
              title="Custo estimado/mes"
              value={
                data?.metrics?.costEstimate
                  ? `$${usd(data.metrics.costEstimate.monthly)}`
                  : "—"
              }
            />
          </div>
        </TabsContent>

        {/* BILLING */}
        <TabsContent value="billing">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <StatCard
              title="Custo API este mes"
              value={`$${usd(apiCost)}`}
            />
            <StatCard
              title="Custos fixos/mes"
              value={`$${usd(fixedTotal)}`}
            />
            <StatCard
              title="Total este mes"
              value={`$${usd(apiCost + fixedTotal)}`}
              color="text-primary"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Custos fixos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fixedCosts.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div>
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({item.note})</span>
                    </div>
                    <span className={`font-mono font-medium ${item.cost > 0 ? "" : "text-muted-foreground"}`}>
                      ${usd(item.cost)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-medium">
                  <span>Total fixo</span>
                  <span className="font-mono">${usd(fixedTotal)}/mes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONFIG */}
        <TabsContent value="config">
          <Card>
            <CardContent className="py-4 space-y-3">
              <ConfigLink label="Backend Health" url={app.services.backend?.healthUrl} />
              <ConfigLink label="Admin Panel" url={app.services.admin?.url} />
              {app.sentry && (
                <ConfigLink
                  label="Sentry Dashboard"
                  url={`https://${app.sentry.org}.sentry.io/issues/?project=${app.sentry.project}`}
                />
              )}
              {app.services.backend?.renderServiceId && (
                <ConfigLink
                  label="Render Dashboard"
                  url={`https://dashboard.render.com/web/${app.services.backend.renderServiceId}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${color ?? ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function ConfigLink({ label, url }: { label: string; url?: string }) {
  if (!url) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline"
      >
        Abrir &rarr;
      </a>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m atras`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atras`;
  return `${Math.floor(hours / 24)}d atras`;
}
