export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  services: {
    backend?: { healthUrl: string; renderServiceId?: string };
    admin?: { url: string; renderServiceId?: string };
  };
  sentry?: {
    org: string;
    project: string;
  };
  apiBase?: string; // for app-specific metrics
}

export const apps: AppConfig[] = [
  {
    id: "simeops",
    name: "SIMEops",
    icon: "🔍",
    description: "Sistema de monitoramento de ocorrências policiais",
    services: {
      backend: {
        healthUrl: "https://simeops-backend.onrender.com/health",
        renderServiceId: process.env.NEXT_PUBLIC_RENDER_SIMEOPS_BACKEND_ID || "",
      },
      admin: {
        url: "https://sistemaprogestao.onrender.com",
        renderServiceId: process.env.NEXT_PUBLIC_RENDER_SIMEOPS_ADMIN_ID || "",
      },
    },
    sentry: {
      org: "joao-mw",
      project: "simeopsbackend",
    },
    apiBase: "https://simeops-backend.onrender.com",
  },
];

export function getApp(id: string): AppConfig | undefined {
  return apps.find((a) => a.id === id);
}
