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

- Último día completado: 2
- Próximo día a correr: 3
- Bloqueado: no
- Razón de bloqueo: —
- Esperando aprobación humana: no

## Infraestructura ya provisionada (fuera del flujo día a día)

- **Neon Postgres**: hay un connection string de desarrollo cargado directamente en las instrucciones de la rutina programada (no en este repo). El Día 4 debe escribirlo en `backend/.env` (gitignored). Es una DB compartida de desarrollo — nunca poner datos reales de clientes ahí.
- **Fly.io**: la app `whatsapp-ventas-saas` ya existe (org `personal`, cuenta berdugo1232@gmail.com), creada el 2026-08-21 antes de llegar al Día 22, para que ese día no se bloquee por falta de cuenta. Todavía NO tiene volumen ni secrets configurados — eso lo hace el propio Día 22 cuando arme el Dockerfile y decida la región/tamaño.

## Log

### Día 2 — 2026-08-21 — Sistema de diseño + landing pública

- Implementado: Tailwind CSS agregado al workspace `frontend` (tailwind/postcss/autoprefixer), `tailwind.config.js` con paleta `brand` (verde, para CTAs/acentos) y `ink` (neutros para texto/fondos) y familia tipográfica `sans` (Inter con fallback). Componentes base en `frontend/src/components/ui/`: `Button` (variantes primary/secondary/outline/ghost, tamaños sm/md/lg, soporta `as="a"`), `Card`, `Input` (con label/error), `Badge` (variantes brand/neutral/outline). Landing pública en `frontend/src/pages/Landing.jsx` montada en `App.jsx`: header con nav a `/login`/`/signup`, hero con propuesta de valor y CTA, sección de 3 planes de precio ($95/$150/$250 por mes, plan Pro destacado) con botones de registro, sección de CTA final, footer. `main.jsx` importa `index.css` (directivas Tailwind + estilos base).
- Commit: f2a6b85
- Tests: no hay suite de tests todavía (arranca en el Día 7). Verificado manualmente: `npm run build --workspace=frontend` compila sin errores, el CSS generado (~11.4 kB) contiene utilidades Tailwind reales (no vacío), y el bundle JS contiene el texto de la propuesta de valor, los 3 planes y los CTAs ("Crear cuenta gratis", sección `#planes`). No se pudo hacer una verificación visual con navegador headless (Playwright no está instalado como dependencia del proyecto y no se agregó solo para este smoke test) — queda pendiente una revisión visual humana rápida si se quiere confirmar el layout responsive antes del Día 3.
- Notas para la próxima corrida: rutas `/login` y `/signup` en el nav de la landing todavía no existen como páginas reales (llegan en el Día 3); por ahora son solo `<a href>` normales sin router — el Día 3 debe decidir si agrega `react-router-dom` o sigue con navegación simple. `npm audit` en frontend reporta 2 vulnerabilidades (1 moderate, 1 high), ambas en `vite`/`esbuild` (afectan solo al dev server, no al build de producción) — ya existían antes de este día, no vienen de Tailwind/PostCSS. El fix requiere saltar a Vite 8 (cambio breaking); no se hace ahora porque el gate de auditoría de seguridad es explícitamente antes del Día 22 — se deja como nota para revisar entonces.

### Día 1 — 2026-08-20 — Repo scaffolding

- Implementado: repo git inicializado (rama `main`) en `Desktop/whatsapp-ventas-saas`, npm workspaces root (`backend`, `frontend`), `.gitignore`, `README.md`, Express mínimo con `/api/health`, Vite + React mínimo con página placeholder. `ROADMAP.md` y `PROGRESS.md` creados con el plan completo de 27 días.
- Commit: d09be28
- Tests: N/A (aún no hay tests; se agregan desde el Día 7)
- Notas para la próxima corrida: no confundir con una versión anterior de este archivo — el roadmap se reordenó el 2026-08-21 (ver nota al inicio de ROADMAP.md). El Día 2 real ahora es **sistema de diseño + landing pública** (Tailwind, paleta de colores, componentes base), no schema de base de datos. El schema de Postgres (que necesita Docker local) pasó al Día 4.
