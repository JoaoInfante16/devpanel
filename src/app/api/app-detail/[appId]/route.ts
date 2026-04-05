import { NextResponse } from "next/server";
import { getApp } from "@/lib/apps-config";
import { checkHealth } from "@/lib/api/health";
import { fetchSentryIssues } from "@/lib/api/sentry";
import { fetchLatestDeploy } from "@/lib/api/render";
import { fetchAppMetrics } from "@/lib/api/app-metrics";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;
  const app = getApp(appId);
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const [health, issues, deploy, metrics] = await Promise.all([
    app.services.backend
      ? checkHealth(app.services.backend.healthUrl)
      : Promise.resolve(null),
    app.sentry
      ? fetchSentryIssues(app.sentry.org, app.sentry.project, 24)
      : Promise.resolve([]),
    app.services.backend?.renderServiceId
      ? fetchLatestDeploy(app.services.backend.renderServiceId)
      : Promise.resolve(null),
    app.apiBase ? fetchAppMetrics(app.apiBase) : Promise.resolve(null),
  ]);

  return NextResponse.json({
    health,
    issues,
    deploy,
    metrics,
  });
}
