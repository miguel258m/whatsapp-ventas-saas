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

**Ritmo temporal acelerado (2026-08-21 → 2026-08-31)**: mientras dura una promoción de límites de uso, la rutina corre cada 4 horas (~6 veces/día) en vez de 1 vez/día, para aprovechar la capacidad extra. Sigue siendo **un ítem de roadmap por corrida**, sin excepciones — la aceleración es solo en frecuencia, no en cuánto abarca cada corrida. Después del 31 de agosto (o al terminar el roadmap, lo que pase primero) debe volver a 1 vez/día (`0 14 * * *`, 9am hora Lima).

## Estado actual

- Último día completado: 1
- Próximo día a correr: 2
- Bloqueado: no
- Razón de bloqueo: —
- Esperando aprobación humana: no

## Infraestructura ya provisionada (fuera del flujo día a día)

- **Neon Postgres**: hay un connection string de desarrollo cargado directamente en las instrucciones de la rutina programada (no en este repo). El Día 4 debe escribirlo en `backend/.env` (gitignored). Es una DB compartida de desarrollo — nunca poner datos reales de clientes ahí.
- **Fly.io**: la app `whatsapp-ventas-saas` ya existe (org `personal`, cuenta berdugo1232@gmail.com), creada el 2026-08-21 antes de llegar al Día 22, para que ese día no se bloquee por falta de cuenta. Todavía NO tiene volumen ni secrets configurados — eso lo hace el propio Día 22 cuando arme el Dockerfile y decida la región/tamaño.

## Log

### Día 1 — 2026-08-20 — Repo scaffolding

- Implementado: repo git inicializado (rama `main`) en `Desktop/whatsapp-ventas-saas`, npm workspaces root (`backend`, `frontend`), `.gitignore`, `README.md`, Express mínimo con `/api/health`, Vite + React mínimo con página placeholder. `ROADMAP.md` y `PROGRESS.md` creados con el plan completo de 27 días.
- Commit: d09be28
- Tests: N/A (aún no hay tests; se agregan desde el Día 7)
- Notas para la próxima corrida: no confundir con una versión anterior de este archivo — el roadmap se reordenó el 2026-08-21 (ver nota al inicio de ROADMAP.md). El Día 2 real ahora es **sistema de diseño + landing pública** (Tailwind, paleta de colores, componentes base), no schema de base de datos. El schema de Postgres (que necesita Docker local) pasó al Día 4.
