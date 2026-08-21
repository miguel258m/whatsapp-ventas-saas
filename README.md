# WhatsApp Ventas SaaS

Plataforma multi-tenant para bots de gestión de ventas por WhatsApp. Reemplaza el modelo actual de "una instalación de escritorio por cliente" por un backend en la nube que atiende a múltiples negocios (tenants), cada uno con su propia sesión de WhatsApp, catálogo, pedidos y dashboard.

Ver [ROADMAP.md](./ROADMAP.md) para el plan de fases/días y [PROGRESS.md](./PROGRESS.md) para el estado actual de avance.

## Estructura

- `backend/` — API Node/Express + Prisma (Postgres) + motor de pedidos + gestor de sesiones WhatsApp
- `frontend/` — React (Vite) — landing, signup, dashboard del dueño, dashboard por tenant
- `infra/` — Dockerfile y configuración de despliegue (Fly.io)
- `docs/` — arquitectura y planes de migración de clientes existentes

## Desarrollo local

```bash
npm install
npm run dev
```
