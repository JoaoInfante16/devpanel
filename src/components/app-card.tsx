"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import type { AppConfig } from "@/lib/apps-config";

interface AppCardData {
  health: "online" | "offline" | "loading";
  errors24h: number | null;
  lastDeploy: string | null;
  latencyMs: number | null;
}

export function AppCard({ app }: { app: AppConfig }) {
  const [data, setData] = useState<AppCardData>({
    health: "loading",
    errors24h: null,
    lastDeploy: null,
    latencyMs: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/app-status/${app.id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setData((d) => ({ ...d, health: "offline" }));
        }
      } catch {
        setData((d) => ({ ...d, health: "offline" }));
      }
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [app.id]);

  return (
    <Link href={`/app/${app.id}`}>
      <Card className="hover:border-primary/30 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{app.icon}</span>
            <CardTitle className="text-base">{app.name}</CardTitle>
          </div>
          <StatusBadge status={data.health} />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            {app.description}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat
              label="Erros 24h"
              value={data.errors24h !== null ? String(data.errors24h) : "—"}
              warn={data.errors24h !== null && data.errors24h > 0}
            />
            <Stat
              label="Latencia"
              value={
                data.latencyMs !== null ? `${data.latencyMs}ms` : "—"
              }
            />
            <Stat
              label="Deploy"
              value={
                data.lastDeploy
                  ? timeAgo(data.lastDeploy)
                  : "—"
              }
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <p
        className={`text-lg font-semibold ${
          warn ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
