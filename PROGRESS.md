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

- Último día completado: 3
- Próximo día a correr: 4
- Bloqueado: sí
- Razón de bloqueo: el entorno de esta corrida (sandbox de red) no puede alcanzar el host de Neon (`ep-summer-scene-ax8kajnz.c-4.us-east-2.aws.neon.tech`) ni por el puerto 5432 (protocolo Postgres) ni por 443 (HTTPS) — el proxy de salida devuelve `403` explícito de política ("gateway answered 403 to CONNECT (policy denial or upstream failure)") para ambos, no un timeout genérico. Ver detalle en el Log del Día 4. Se necesita que el dueño del proyecto habilite `neon.tech`/el host específico en la política de red del entorno de las corridas programadas, o indique una forma alternativa de correr `prisma migrate dev`/el seed contra esa DB (ej. desde un entorno con acceso, o un connection string que sí sea alcanzable desde este sandbox).
- Esperando aprobación humana: no

## Infraestructura ya provisionada (fuera del flujo día a día)

- **Neon Postgres**: hay un connection string de desarrollo cargado directamente en las instrucciones de la rutina programada (no en este repo). El Día 4 debe escribirlo en `backend/.env` (gitignored). Es una DB compartida de desarrollo — nunca poner datos reales de clientes ahí.
- **Fly.io**: la app `whatsapp-ventas-saas` ya existe (org `personal`, cuenta berdugo1232@gmail.com), creada el 2026-08-21 antes de llegar al Día 22, para que ese día no se bloquee por falta de cuenta. Todavía NO tiene volumen ni secrets configurados — eso lo hace el propio Día 22 cuando arme el Dockerfile y decida la región/tamaño.

## Log

### Día 4 (bloqueado) — 2026-08-21 — Postgres schema v1

- Preparado (sin verificar contra DB real): `prisma` + `@prisma/client` agregados al workspace `backend`. Nota de versión: la última estable (`7.9.1`, instalada primero) rompe con este schema porque Prisma 7 eliminó `datasource.url` del schema file a favor de `prisma.config.ts` + un `adapter` explícito en el `PrismaClient` — un cambio de API considerablemente más grande que el alcance de este día. Se optó por fijar `prisma`/`@prisma/client` en `6.19.3` (última estable de la serie 6, que sigue soportando `datasource { url = env("DATABASE_URL") }` clásico), en vez de adoptar el patrón de adapters de Prisma 7 sin poder siquiera probarlo contra una DB real. Revisar si vale la pena migrar a Prisma 7 más adelante, cuando haya acceso de red para probarlo de punta a punta.
- `backend/prisma/schema.prisma` escrito con los 9 modelos del alcance del día (`Tenant`, `User`, `Plan`, `Subscription`, `CatalogItem`, `Order`, `Message`, `WhatsappSession`, `Reservation`, `MetricsEvent`), enums para status/roles, y `tenantId` indexado en cada modelo tenant-scoped (preparando el middleware de tenant-scoping del Día 5). `npx prisma generate` corre limpio (no necesita conexión a la DB, solo valida el schema).
- `backend/.env` (gitignored, no committeado) escrito con el `DATABASE_URL` de Neon provisto en las instrucciones de la rutina y un `JWT_SECRET` placeholder para el Día 5.
- **Bloqueador real**: `npx prisma migrate dev` falla con `P1001: Can't reach database server at ep-summer-scene-ax8kajnz.c-4.us-east-2.aws.neon.tech:5432`. Se investigó si era un problema de proxy HTTP (el entorno de esta corrida sale a internet vía un proxy HTTPS en `127.0.0.1:35481`, ver `/root/.ccr/README.md`) — pero el protocolo Postgres no es HTTP y no pasa por ese proxy. Se probó también acceso directo por HTTPS (puerto 443) al mismo host y a `console.neon.tech`, y ambos devuelven `403` explícito de política del gateway de salida (`curl: (56) CONNECT tunnel failed, response 403`, confirmado en `/__agentproxy/status` → `recentRelayFailures`). Es decir: no es un problema de protocolo/puerto, es que la política de red de este entorno bloquea el host de Neon por completo. Siguiendo la regla del proxy de no reintentar ni rodear denegaciones de política 403, no se intentó ningún workaround (túnel SSH, etc.) — se marca `Bloqueado` en su lugar.
- Tests: no aplica (no hay tests de backend nuevos este día; el criterio "hecho cuando" del Día 4 —`npx prisma migrate dev` funciona y el seed puebla una DB— no se pudo verificar por el bloqueador de red descrito arriba).
- Commit: este mismo commit (no es `feat(day-04)` porque el día no está completo — no se marcó el ítem en `ROADMAP.md` ni se avanzó "Último día completado"/"Próximo día a correr").
- Notas para la próxima corrida: si la política de red ya permite alcanzar `neon.tech` (puerto 5432 y/o 443), correr `cd backend && npx prisma migrate dev --name init` y luego escribir+correr el script de seed (tenant + usuario dueño falsos) que todavía falta — el schema ya está listo, solo falta la migración y el seed. Si sigue bloqueado, no repetir la investigación de red desde cero: ya se confirmó que es una denegación de política 403 explícita, no un timeout ambiguo.

### Día 3 — 2026-08-21 — Pantallas de Login y Signup (diseño)

- Nota de mantenimiento antes de empezar: la corrida anterior (Día 2) había commiteado en un HEAD detached que nunca llegó a `main` ni a `origin/main` (quedó como commit huérfano `022c82b`). `PROGRESS.md` decía "Último día completado: 2" pero el código real seguía en el Día 1 en el branch remoto. Esta corrida hizo `git checkout main && git merge --ff-only 022c82b && git push` antes de tocar nada del Día 3, para que el historial de `main` coincida con lo que dice este archivo. Corridas futuras: verificar `git status`/`git branch -vv` al inicio, no asumir que se está sobre `main`.
- Implementado: agregado `react-router-dom` al workspace `frontend` (se decidió agregar router real ahora en vez de navegación simple, ya que vienen más pantallas — dashboard dueño, dashboard tenant — en los próximos días). `main.jsx` envuelve `App` en `BrowserRouter`; `App.jsx` define rutas `/`, `/login`, `/signup`. `Landing.jsx` actualizado para usar `<Link>` de router en vez de `<a href>` planos para los CTAs internos (se mantiene `<a href="#planes">` para el anchor interno). Nuevas páginas `frontend/src/pages/Login.jsx` y `frontend/src/pages/Signup.jsx` con el sistema de diseño del Día 2 (`Card`, `Input`, `Button`): validación básica en cliente (email con formato válido, password ≥6 caracteres, confirmación de password coincide en signup, nombre de negocio requerido en signup) con mensajes de error por campo; estado de carga (botón deshabilitado + texto "Ingresando…"/"Creando cuenta…" durante un submit simulado); estado post-submit mostrando que la conexión real al backend llega en el Día 6 (todavía sin fetch real, estado 100% local).
- Commit: este mismo commit (`feat(day-03): ...`, ver `git log` — el hash no se referencia literalmente para evitar el problema de auto-referencia de incluir el propio hash del commit dentro de su contenido)
- Tests: no hay suite de tests todavía (arranca en el Día 7). Verificado: `npm run build --workspace=frontend` compila sin errores. Verificación funcional con Playwright headless (binario global en `/opt/pw-browsers/chromium`, sin agregarlo como dependencia del proyecto, siguiendo la nota dejada en el Día 2) contra `vite preview`: `/`, `/login` y `/signup` cargan con el contenido esperado; clic en "Iniciar sesión" desde la landing navega a `/login` sin recarga completa de página (routing client-side real); submit vacío en `/login` muestra el error de validación "Ingresa tu email."; submit con datos válidos pasa por el estado de carga y llega al estado post-submit "Datos válidos...".
- Notas para la próxima corrida: el Día 4 (Postgres schema v1) es el primer día que necesita una DB — usar el `DATABASE_URL` de Neon ya provisto en las instrucciones de la rutina, escribirlo en `backend/.env` (gitignored, no crear commit con el valor). `npm audit` en frontend ahora reporta 1 alta + 1 moderada en `vite`/`esbuild` (sin cambios respecto al Día 2, ver nota de esa entrada) — sigue pendiente de revisar antes del Día 22, no antes.

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
