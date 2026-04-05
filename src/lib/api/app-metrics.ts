export interface AppMetrics {
  totalNews: number;
  totalScans: number;
  activeLocations: number;
  costEstimate: { monthly: number; perCity: number } | null;
}

export async function fetchAppMetrics(
  apiBase: string
): Promise<AppMetrics | null> {
  try {
    const [healthRes, settingsRes] = await Promise.all([
      fetch(`${apiBase}/health`, { cache: "no-store" }).catch(() => null),
      fetch(`${apiBase}/settings/cost-estimate`, {
        next: { revalidate: 300 },
      }).catch(() => null),
    ]);

    const health = healthRes?.ok ? await healthRes.json() : null;
    const cost = settingsRes?.ok ? await settingsRes.json() : null;

    return {
      totalNews: health?.stats?.totalNews ?? 0,
      totalScans: health?.stats?.totalScans ?? 0,
      activeLocations: health?.stats?.activeLocations ?? 0,
      costEstimate: cost
        ? { monthly: cost.totalMonthly, perCity: cost.perCity }
        : null,
    };
  } catch {
    return null;
  }
}
