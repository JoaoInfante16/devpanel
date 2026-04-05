# Dev Panel — Progresso

## O que é
Painel de DevOps pessoal do João. Hub centralizado pra monitorar todos os apps que ele construir. Roda **local** (não precisa de deploy), acessa do PC e celular pela LAN. Atalho .bat no desktop pra abrir com 2 cliques.

## Stack
- Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- Dark theme
- Roda em `localhost:3100`
- Projeto em `c:/Projetos/dev-panel/` (repo separado do SIMEops)

## Primeiro app conectado: SIMEops
- Backend: https://simeops-backend.onrender.com (Render, Docker, staging)
- Admin: https://sistemaprogestao.onrender.com (Render, Node, staging)
- Sentry: org `joao-mw`, project `simeopsbackend`
- Sentry DSN: no backend/.env

## Funcionalidades planejadas (Fase 1)

### Dashboard Principal (/)
- Grid de cards, 1 por app registrado
- Cada card mostra:
  - Nome do app + ícone
  - Badge: verde (Online) / vermelho (Offline) via health check
  - Erros: contagem últimas 24h (Sentry API)
  - Uptime: % baseado nos health checks
  - Último deploy: data (Render API)
- Clicar no card → página detalhada

### Página Detalhada (/app/[appId])
Tabs:
- **Overview**: status, uptime, erros 24h, métricas chave
- **Erros**: feed de erros do Sentry (título, stack trace resumido, frequência, last seen)
- **Métricas**: custos do mês, scans realizados, notícias salvas (puxa API do SIMEops)
- **Logs**: últimos logs do backend (Sentry breadcrumbs)
- **Config**: links pra Render/Sentry dashboards

### Integrações
- **Sentry API**: `GET /api/0/projects/{org}/{project}/issues/` — erros recentes
- **Render API**: `GET /services/{id}` — status deploy
- **SIMEops API**: `/settings/cost-estimate` + `/health` — métricas operacionais
- **Health check**: fetch periódico no `/health` do backend

### Atalho Desktop
`C:/Users/joaoi/Desktop/DevPanel.bat`:
```bat
@echo off
start http://localhost:3100
cd /d C:\Projetos\dev-panel
npm run dev -- -p 3100
```

### VSCode Workspace
`c:/Projetos/simeops.code-workspace` pra abrir SIMEops + DevPanel juntos.

---

## Status atual
- [x] Projeto Next.js criado (`c:/Projetos/dev-panel/`)
- [ ] Instalar shadcn/ui
- [ ] Layout base (dark theme, sidebar)
- [ ] Config de apps (`apps-config.ts`)
- [ ] Sentry API client
- [ ] Health checker
- [ ] App card component (badge verde/vermelho)
- [ ] Dashboard principal
- [ ] Página detalhada do app
- [ ] Error feed component
- [ ] Metrics panel
- [ ] Atalho .bat no desktop
- [ ] VSCode workspace file

---

## Contexto SIMEops (pra referência)
- Fase 4: COMPLETA (Bright Data dual mode, pipeline, Flutter polido, acentuação, push)
- Fase 5: Sentry backend ✅ | Deploy staging ✅ | Dev Panel 🔄 | Deploy produção ⏳
- Plano completo: `c:/Projetos/Netrios News/.claude/plans/floating-prancing-dragon.md`
