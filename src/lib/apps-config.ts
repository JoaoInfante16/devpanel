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
  fixedCosts?: { name: string; cost: number; note: string }[];
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
    fixedCosts: [
      { name: "Servidores (Render)", cost: 14.0, note: "Backend + Admin" },
      { name: "Monitoramento de erros", cost: 29.0, note: "Rastreamento em tempo real" },
      { name: "Banco de dados", cost: 0.0, note: "Supabase Free" },
      { name: "Cache/Fila", cost: 0.0, note: "Upstash Redis Free" },
    ],
  },
];

export function getApp(id: string): AppConfig | undefined {
  return apps.find((a) => a.id === id);
}
