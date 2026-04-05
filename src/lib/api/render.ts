const RENDER_TOKEN = process.env.RENDER_API_KEY || "";
const RENDER_BASE = "https://api.render.com/v1";

export interface RenderDeploy {
  id: string;
  status: string;
  createdAt: string;
  finishedAt: string | null;
  commit?: { message: string; id: string };
}

export async function fetchLatestDeploy(
  serviceId: string
): Promise<RenderDeploy | null> {
  if (!RENDER_TOKEN || !serviceId) return null;

  try {
    const res = await fetch(
      `${RENDER_BASE}/services/${serviceId}/deploys?limit=1`,
      {
        headers: { Authorization: `Bearer ${RENDER_TOKEN}` },
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const deploys = Array.isArray(data) ? data : data.deploys || [];
    if (deploys.length === 0) return null;

    const d = deploys[0].deploy || deploys[0];
    return {
      id: d.id,
      status: d.status,
      createdAt: d.createdAt,
      finishedAt: d.finishedAt,
      commit: d.commit,
    };
  } catch {
    return null;
  }
}
