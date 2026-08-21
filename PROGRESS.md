# Progress Log

Estado vivo que cada corrida diaria automática lee y actualiza. Ver [ROADMAP.md](./ROADMAP.md) para el detalle de cada día.

## Cómo debe operar cada corrida diaria

1. Leer "Estado actual" abajo y `ROADMAP.md` para encontrar el próximo ítem sin marcar.
2. Si la corrida anterior dejó `Bloqueado: sí`, revisar si el prerequisito ya se resolvió; si sigue faltando, dejar una entrada de recordatorio y detenerse **sin** avanzar el contador de día.
3. Implementar **un solo** ítem del día — sin adelantar alcance del día siguiente.
4. Correr tests/build existentes; si fallan o no se puede verificar el criterio "hecho cuando", no commitear código roto — marcar `Bloqueado: sí` con razón clara en su lugar.
5. Commitear con mensaje `feat(day-NN): <título del día>`, así el historial de git mapea 1:1 con los ítems del roadmap.
6. Marcar el ítem en `ROADMAP.md`, actualizar "Estado actual" abajo y agregar una entrada al Log, en el mismo commit.
7. Detenerse — aunque sobre tiempo, un día de calendario = un ítem de roadmap, para que cada diff siga siendo revisable y el árbol siga funcionando.

**Regla de seguridad dura para los días 25 y 26**: la corrida automática nunca ejecuta el corte de un cliente real (Lima Criolla, CITED) en vivo por sí sola. Prepara todo y deja `Esperando aprobación humana: sí`, luego se detiene. El corte real solo avanza cuando el usuario lo aprueba explícitamente en una conversación.

## Estado actual

- Último día completado: 1
- Próximo día a correr: 2
- Bloqueado: no
- Razón de bloqueo: —
- Esperando aprobación humana: no

## Log

### Día 1 — 2026-08-20 — Repo scaffolding

- Implementado: repo git inicializado (rama `main`) en `Desktop/whatsapp-ventas-saas`, npm workspaces root (`backend`, `frontend`), `.gitignore`, `README.md`, Express mínimo con `/api/health`, Vite + React mínimo con página placeholder. `ROADMAP.md` y `PROGRESS.md` creados con el plan completo de 27 días.
- Commit: d09be28
- Tests: N/A (aún no hay tests; se agregan desde el Día 7)
- Notas para la próxima corrida: no confundir con una versión anterior de este archivo — el roadmap se reordenó el 2026-08-21 (ver nota al inicio de ROADMAP.md). El Día 2 real ahora es **sistema de diseño + landing pública** (Tailwind, paleta de colores, componentes base), no schema de base de datos. El schema de Postgres (que necesita Docker local) pasó al Día 4.
