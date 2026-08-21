# Roadmap

Checklist estático de fases y días. Cada día = una corrida automática = un commit. Solo se edita este archivo si cambia el alcance de forma deliberada (no en corridas rutinarias). Ver [PROGRESS.md](./PROGRESS.md) para el estado vivo.

> **Reordenado el 2026-08-21**: el diseño visual (landing, colores, login/signup) se adelantó a los primeros días porque es lo que se necesita para empezar a vender, y no depende del backend. El motor del bot y los dashboards siguen después. Los días 25-26 (corte de clientes reales) mantienen su numeración original.

## 🔒 Restricción no negociable: seguridad

Esto maneja datos de negocio de varios clientes reales (catálogos, pedidos, números de contacto). Estas reglas aplican a **todo** día que toque backend, auth o infraestructura, no son opcionales:

- **Aislamiento entre tenants es lo más crítico.** Toda query a `catalog_items`, `orders`, `messages`, `reservations`, etc. debe pasar por el middleware de tenant-scoping del Día 5 (`req.tenantId` desde el JWT) — nunca un `tenantId` que venga del body/query de la petición sin validar contra el usuario autenticado. El criterio "403 en llamada cross-tenant" del Día 16 debe probarse explícitamente, no darse por sentado.
- **Nunca commitear secretos.** API keys, connection strings, JWT secrets siempre en `.env` (gitignored) o en secrets de Fly — nunca en código, nunca en mensajes de commit, nunca en `ROADMAP.md`/`PROGRESS.md`.
- **Passwords**: bcrypt (o argon2), nunca texto plano ni hashes propios. JWT con expiración razonable (no tokens eternos).
- **Rate limiting** en endpoints de login/signup desde el Día 5, para evitar fuerza bruta — si no se implementa ese día por alcance, debe quedar anotado como pendiente explícito en `PROGRESS.md`, no olvidado.
- **Validación de entrada** en toda ruta que reciba datos del cliente (Prisma ya previene SQL injection por queries parametrizadas, pero igual validar tipos/tamaños antes de tocar la DB).
- **Antes del Día 22 (deploy real)**: correr `npm audit` en ambos workspaces y resolver vulnerabilidades altas/críticas antes de desplegar — si quedan sin resolver, documentar por qué en `PROGRESS.md`, no ignorarlas en silencio.
- **Antes de los Días 25-26 (clientes reales)**: yo (en conversación en vivo, no la corrida automática) voy a correr una revisión de seguridad completa del código antes de aprobar el corte — la corrida automática no necesita hacer esto sola, solo debe dejar el código en un estado revisable.
- **El repo es público hoy** por una limitación de permisos de GitHub que no logramos resolver (ver nota en README o preguntarme). No hay secretos committeados, pero antes de manejar datos reales de clientes conviene volverlo privado si encontramos cómo dar ese acceso — pendiente, no bloqueante para el desarrollo.

## ⚠️ Restricción no negociable: anti-baneo de WhatsApp

Usamos `whatsapp-web.js` (conexión no oficial), así que el riesgo de que WhatsApp banee el número de un cliente es real y su costo es alto (cliente real sin servicio). Esto **no es una feature más, es un requisito duro** en todos los días que toquen el motor de mensajería:

- **Día 10** debe portar el debounce/pacing del `bot.js` actual (`encolarMensaje`/`procesarBuffer`/`conColaGlobal`) con paridad completa, nunca una versión simplificada "para salir del paso". Si el test de fake timers no confirma el comportamiento exacto, el día se marca `Bloqueado`, no se hace un shortcut.
- **Día 11/13** (sessionManager y recuperación ante crash) deben garantizar que **nunca haya dos procesos/sesiones activos para el mismo número de WhatsApp a la vez** (ej. un worker viejo que no murió bien + uno nuevo re-lanzado) — eso es una causa común de baneo.
- Ningún día de Fase E puede reconectar o relanzar una sesión de forma agresiva (reintentos sin backoff, reconexiones en loop) — ya está cubierto por el backoff exponencial del Día 13, pero es un criterio a verificar explícitamente antes del corte de clientes reales (Días 25-26).
- Si alguna corrida automática necesita simplificar o posponer algo de esta lista por falta de tiempo, debe marcar `Bloqueado: sí` con la razón — nunca avanzar con una versión debilitada de las protecciones anti-baneo.

## Fase A — Diseño, landing y fundación

- [x] **Día 1 — Repo scaffolding.** Init git, npm workspaces root, `.gitignore`, `README.md`, Express vacío (`backend`) y Vite React vacío (`frontend`) que ambos arrancan. `ROADMAP.md` y `PROGRESS.md` creados.
  Hecho cuando: `npm install` en la raíz funciona, `npm run dev` levanta ambos, primer commit hecho.
- [x] **Día 2 — Sistema de diseño + landing pública.** Definir paleta de colores, tipografía y componentes base (botones, cards, inputs, badges) con Tailwind CSS. Construir la landing pública (`/`) usando ese sistema: propuesta de valor, planes de precio (~$95-250/mes según el plan de negocio existente), CTA de registro. Sin backend real todavía — solo frontend.
  Hecho cuando: la landing carga en `/` con el sistema de diseño aplicado, es accesible sin login, y el CTA es visible.
- [x] **Día 3 — Pantallas de Login y Signup (diseño).** Construir `/login` y `/signup` con el mismo sistema de diseño: formularios estilizados, validación básica en el cliente, estados de carga/error. Todavía sin conexión real a backend (estado local/mock).
  Hecho cuando: ambas pantallas son navegables, responden a validación básica en el cliente, y siguen visualmente el sistema de diseño del Día 2.
- [ ] **Día 4 — Postgres schema v1.** Agregar Prisma, escribir `schema.prisma` (tenants, users, plans, subscriptions, catalog_items, orders, messages, whatsapp_sessions, reservations, metrics_events), primera migración, script de seed con un tenant + un usuario dueño falsos. Postgres local vía Docker para desarrollo.
  Hecho cuando: `npx prisma migrate dev` funciona localmente, el seed puebla una DB local funcional.
- [ ] **Día 5 — Auth backend.** Hash de contraseñas (bcrypt), emisión de JWT, `/api/login`, `/api/me`, middleware de rol (`owner_admin`/`tenant_admin`/`tenant_staff`), middleware de tenant-scoping que inyecta `req.tenantId` desde el JWT.
  Hecho cuando: el usuario dueño sembrado puede loguearse vía `POST /api/login`, una ruta protegida rechaza peticiones sin token válido.
- [ ] **Día 6 — Conectar Login/Signup reales al backend.** Reemplazar el mock del Día 3: `/login` llama a `/api/login` real y guarda el token; `/signup` crea un tenant `trial` + usuario `tenant_admin` real en la DB y notifica al dueño (berdugo1232@gmail.com).
  Hecho cuando: loguearse con el usuario dueño sembrado en el navegador lleva a un dashboard vacío; enviar el formulario de signup crea una fila real en `tenants` con status `trial` (verificable por query directa a la DB — verlo en el dashboard del dueño llega en el Día 15).

## Fase B — Motor multi-tenant del bot

- [ ] **Día 7 — Extraer helpers puros del motor.** Portar `calcularTotalCarrito`, `formatearCarrito`, `matchPlato`, `normalizar`, `formatearResumenConTotal`, `calcularEstadoPedido` desde `Instalador-LimaCriolla/bot.js` a `backend/src/engine/`, parametrizados por el catálogo del tenant. Tests unitarios con el `catalogo.json` real de Lima Criolla como fixture.
  Hecho cuando: los tests de total de carrito y match de platos pasan contra los datos reales.
- [ ] **Día 8 — Portar el constructor de prompt.** `promptBuilder.js` tenant-aware que reproduce `construirPrompt()`/`formatearCatalogoPrompt()`, recibiendo `{catalog, businessInfoMd, settings}`, preservando el contrato exacto de tags (`[AGREGAR]`/`[QUITAR]`/`[PEDIDO_LISTO]`/etc).
  Hecho cuando: el prompt generado para el fixture de Lima Criolla coincide con un snapshot esperado.
- [ ] **Día 9 — Portar el motor de pedidos.** `orderEngine.processMessage(tenantId, chatId, text)` tenant-aware, llamando a la API de Anthropic, parseando tags, aplicando las reglas de disponibilidad por día/hora **en código**, actualizando el carrito, persistiendo en Postgres (`orders`/`messages`) en vez de archivos JSON.
  Hecho cuando: una conversación de prueba scripted contra el fixture produce un total y pedido final que coincide con un resultado verificado a mano.
- [ ] **Día 10 — Portar debounce/anti-baneo.** Equivalentes tenant+chat-keyed de `encolarMensaje`/`procesarBuffer`/`conColaGlobal`.
  Hecho cuando: un test con fake timers muestra que mensajes rápidos dentro de `DEBOUNCE_MS` colapsan en una sola llamada al motor.
- [ ] **Día 11 — Esqueleto del gestor de sesiones WhatsApp.** `sessionManager.js` que hace fork/stop de un proceso hijo por tenant; el hijo crea un `Client` de `whatsapp-web.js` con `LocalAuth({dataPath: data/tenants/<id>/.wwebjs_auth})`, emite `qr`/`ready`/`disconnected` vía IPC.
  Hecho cuando: arrancar un worker para un tenant semilla muestra un QR real y escanearlo con un número de WhatsApp de prueba llega a estado `connected` en la DB.
- [ ] **Día 12 — Conectar worker al motor.** El handler de `message` del worker llama a `orderEngine.processMessage` y envía la respuesta de vuelta por `whatsapp-web.js`.
  Hecho cuando: un mensaje real de WhatsApp a la sesión de prueba produce una respuesta correcta de la IA y crea una fila en `orders`.
- [ ] **Día 13 — Recuperación ante crash + re-conexión al arrancar.** Al iniciar el backend, relanzar un worker por cada tenant con `status=active`, reutilizando su carpeta de auth guardada; reinicio automático con backoff si un worker muere inesperadamente.
  Hecho cuando: matar un worker a mitad de sesión reinicia y reconecta automáticamente sin escanear un QR nuevo.
- [ ] **Día 14 — Notas de voz + import de catálogo por PDF** (menor prioridad, puede deslizarse sin bloquear días siguientes). Portar `transcribirAudio`/`generarNotaDeVoz`/`leerCatalogoDesdePDF` como funciones tenant-aware.
  Hecho cuando: una nota de voz de prueba se transcribe y responde; un PDF de prueba puebla `catalog_items`.

## Fase C — Dashboards

- [ ] **Día 15 — Dashboard dueño: lista de tenants + crear tenant.** Tabla cross-tenant (nombre/estado/conectado/plan/creado), formulario crear-tenant (crea `tenants` + primer `tenant_admin`). Aquí se ve por primera vez en UI el tenant trial creado el Día 6.
  Hecho cuando: el dueño puede crear un tenant desde la UI y verlo listado con estado de conexión en vivo, y el tenant trial del Día 6 aparece en la lista.
- [ ] **Día 16 — Shell del dashboard por tenant.** Nav (Pedidos/Catálogo/Conversaciones/Config/WhatsApp), todas las llamadas con tenant-scoping del Día 5, estados vacíos por sección.
  Hecho cuando: una llamada cross-tenant como `tenant_admin` devuelve 403.
- [ ] **Día 17 — Kanban de pedidos.** Portar el tablero de 5 columnas (Armando pedido → Por pagar → Comprobante enviado → Pagados → Cancelados) como componente React sobre `/api/tenant/orders`, actualización en vivo vía el hub de tiempo real.
  Hecho cuando: un pedido simulado de WhatsApp aparece en la columna correcta en segundos sin refrescar manualmente.
- [ ] **Día 18 — Editor de catálogo.** CRUD de `catalog_items` (nombre/categoría/precio/variantes/disponibilidad día-hora/activo), trigger de import por PDF.
  Hecho cuando: editar un precio en la UI cambia lo que cotiza el bot en el siguiente mensaje de prueba.
- [ ] **Día 19 — Pantalla de conexión WhatsApp + toggle IA/humano.** QR, estado de conexión, controles reconectar/desconectar, toggle global y por conversación, visor de conversaciones.
  Hecho cuando: un tenant nuevo pasa de "sin sesión" a "conectado, escaneado, viendo mensajes en vivo" completamente desde el dashboard.
- [ ] **Día 20 — Reservas, promociones, config de negocio.** Portar lista de `reservas` (marcar atendida), editor de promociones, editor de info de negocio en DB reemplazando `empresa.md`.
  Hecho cuando: editar info de negocio en la UI cambia el system prompt vivo en el siguiente mensaje.

> **🎬 Hito: listo para grabar el video promocional.** Al terminar el Día 20, la plataforma corre localmente de punta a punta: landing con diseño, login/signup reales, un tenant de prueba recibiendo pedidos reales por WhatsApp, dashboard con Kanban de pedidos, catálogo, conexión WhatsApp y reservas/promos. No hace falta esperar al deploy en la nube (Fase E) para grabar — eso llega después, para vender de verdad con clientes reales.

## Fase D — Billing

- [ ] **Día 21 — Billing stub.** Sembrar tiers de plan reales; `subscriptions.status` alternado manualmente por el dueño desde el dashboard; un tenant `past_due`/`canceled` pausa automáticamente su worker (deja de responder clientes, sin pasarela de pago real todavía).
  Hecho cuando: poner un tenant en `canceled` pausa su worker sin afectar a otros.

## Fase E — Deploy, piloto y migración de clientes reales

- [ ] **Día 22 — Deploy a Fly.io.** Dockerfile con Chromium correcto para Puppeteer, `fly.toml` con volumen montado para `/data/tenants`, `DATABASE_URL` de Neon como secret de Fly. *(Requiere humano: confirmar que existen la app Fly y el proyecto Neon; si falta un secret, este día hace lo que pueda del código/config y se marca `Blocked` en vez de adivinar credenciales.)*
  Hecho cuando: la plataforma es alcanzable en una URL `*.fly.dev`, el dueño puede loguearse, y un tenant de prueba conecta un número real de punta a punta en la nube.
- [ ] **Día 23 — Tenant piloto.** Correr un piloto realista (tenant demo interno o un prospecto real de bajo riesgo) completamente en la plataforma en la nube.
  Hecho cuando: el piloto tomó ≥1 pedido real de punta a punta y sobrevivió ≥1 deploy/reinicio de Fly sin perder su sesión de WhatsApp.
- [ ] **Día 24 — Preparación migración Lima Criolla.** Script de importación único JSON→Postgres (`catalogo.json` + `empresa-restaurante.md` → `catalog_items`/`tenants.settings`), reusable para CITED. Levantar Lima Criolla como tenant conectado a un **número de WhatsApp de prueba separado** para verificación en paralelo contra el bot de escritorio en vivo.
  Hecho cuando: conversaciones de prueba scripted lado a lado contra el viejo y el nuevo producen totales/comportamiento coincidentes en un checklist de escenarios representativo.
- [ ] **Día 25 — Corte de Lima Criolla.** *(La corrida automática prepara todo pero se detiene esperando aprobación humana explícita antes de tocar el número en vivo — marcado vía `Awaiting human approval` en PROGRESS.md, no se ejecuta desatendido.)* En una ventana de bajo tráfico: detener el bot de escritorio viejo, re-vincular el tenant de la plataforma al número real de Lima Criolla, monitorear de cerca. La instalación vieja se mantiene intacta y re-arrancable como rollback por un período de gracia definido (7-14 días).
  Hecho cuando: 48+ horas de tráfico en vivo en la nueva plataforma sin incidentes.
- [ ] **Día 26 — Migración de CITED.** Repetir los pasos de import + paralelo + corte de los días 24-25 para CITED, mismo gate de aprobación humana antes del corte en vivo.
  Hecho cuando: CITED en vivo en la nueva plataforma por 48+ horas sin incidentes, instalación vieja retenida como rollback.
- [ ] **Día 27 — Decomiso + hardening.** Tras pasar ambos períodos de gracia sin necesidad de rollback: archivar (no borrar) las carpetas/zips viejas por cliente, agregar alertas por sesión de WhatsApp caída, escribir un doc corto de lecciones aprendidas, actualizar `ROADMAP.md`/`PROGRESS.md` con una sección "qué sigue" (integración de pasarela de pago real, Fly Machines por tenant si se escala más allá de la capacidad actual, fase de Meta Cloud API oficial según el plan de negocio existente).
  Hecho cuando: tanto roadmap como progreso reflejan migración completa, checklist de decomiso cerrado.
