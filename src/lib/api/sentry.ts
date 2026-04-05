const SENTRY_TOKEN = process.env.SENTRY_AUTH_TOKEN || "";
const SENTRY_BASE = "https://sentry.io/api/0";

interface SentryIssue {
  id: string;
  title: string;
  shortId: string;
  count: string;
  level: string;
  firstSeen: string;
  lastSeen: string;
  status: string;
  culprit: string;
  metadata: { type?: string; value?: string };
}

export interface SentryIssueSummary {
  id: string;
  title: string;
  shortId: string;
  count: number;
  level: string;
  firstSeen: string;
  lastSeen: string;
  culprit: string;
}

export async function fetchSentryIssues(
  org: string,
  project: string,
  hours = 24
): Promise<SentryIssueSummary[]> {
  if (!SENTRY_TOKEN) return [];

  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const url = `${SENTRY_BASE}/projects/${org}/${project}/issues/?query=is:unresolved&sort=date&statsPeriod=${hours}h&since=${since}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${SENTRY_TOKEN}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const issues: SentryIssue[] = await res.json();
    return issues.map((i) => ({
      id: i.id,
      title: i.title,
      shortId: i.shortId,
      count: parseInt(i.count, 10),
      level: i.level,
      firstSeen: i.firstSeen,
      lastSeen: i.lastSeen,
      culprit: i.culprit,
    }));
  } catch {
    return [];
  }
}

export async function fetchSentryErrorCount(
  org: string,
  project: string,
  hours = 24
): Promise<number> {
  const issues = await fetchSentryIssues(org, project, hours);
  return issues.reduce((sum, i) => sum + i.count, 0);
}
