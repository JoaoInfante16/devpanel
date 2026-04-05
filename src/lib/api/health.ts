export interface HealthResult {
  status: "online" | "offline";
  latencyMs: number;
  checkedAt: string;
}

export async function checkHealth(url: string): Promise<HealthResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    return {
      status: res.ok ? "online" : "offline",
      latencyMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return {
      status: "offline",
      latencyMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
    };
  }
}
