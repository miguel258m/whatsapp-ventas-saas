# Roadmap

Checklist estático de fases y días. Cada día = una corrida automática = un commit. Solo se edita este archivo si cambia el alcance de forma deliberada (no en corridas rutinarias). Ver [PROGRESS.md](./PROGRESS.md) para el estado vivo.

## Fase A — Fundación

- [x] **Día 1 — Repo scaffolding.** Init git, npm workspaces root, `.gitignore`, `README.md`, Express vacío (`backend`) y Vite React vacío (`frontend`) que ambos arrancan. `ROADMAP.md` y `PROGRESS.md` creados.
  Hecho cuando: `npm install` en la raíz funciona, `npm run dev` levanta ambos, primer commit hecho.
- [ ] **Día 2 — Postgres schema v1.** Agregar Prisma, escribir `schema.prisma` (tenants, users, plans, subscriptions, catalog_items, orders, messages, whatsapp_sessions, reservations, metrics_events), primera migración, script de seed con un tenant + un usuario dueño falsos. Postgres local vía Docker para desarrollo.
  Hecho cuando: `npx prisma migrate dev` funciona localmente, el seed puebla una DB local funcional.
- [ ] **Día 3 — Auth backend.** Hash de contraseñas (bcrypt), emisión de JWT, `/api/login`, `/api/me`, middleware de rol (`owner_admin`/`tenant_admin`/`tenant_staff`), middleware de tenant-scoping que inyecta `req.tenantId` desde el JWT.
  Hecho cuando: el usuario dueño sembrado puede loguearse vía `POST /api/login`, una ruta protegida rechaza peticiones sin token válido.
- [ ] **Día 4 — Frontend auth shell.** React Router, página de login conectada al backend, contexto de auth/almacenamiento de token, wrapper de ruta protegida, nav mínima que distingue vista dueño vs tenant.
  Hecho cuando: loguearse como el dueño sembrado en el navegador lleva a un dashboard vacío.

## Fase B — Motor multi-tenant del bot

- [ ] **Día 5 — Extraer helpers puros del motor.** Portar `calcularTotalCarrito`, `formatearCarrito`, `matchPlato`, `normalizar`, `formatearResumenConTotal`, `calcularEstadoPedido` desde `Instalador-LimaCriolla/bot.js` a `backend/src/engine/`, parametrizados por el catálogo del tenant. Tests unitarios con el `catalogo.json` real de Lima Criolla como fixture.
  Hecho cuando: los tests de total de carrito y match de platos pasan contra los datos reales.
- [ ] **Día 6 — Portar el constructor de prompt.** `promptBuilder.js` tenant-aware que reproduce `construirPrompt()`/`formatearCatalogoPrompt()`, recibiendo `{catalog, businessInfoMd, settings}`, preservando el contrato exacto de tags (`[AGREGAR]`/`[QUITAR]`/`[PEDIDO_LISTO]`/etc).
  Hecho cuando: el prompt generado para el fixture de Lima Criolla coincide con un snapshot esperado.
- [ ] **Día 7 — Portar el motor de pedidos.** `orderEngine.processMessage(tenantId, chatId, text)` tenant-aware, llamando a la API de Anthropic, parseando tags, aplicando las reglas de disponibilidad por día/hora **en código**, actualizando el carrito, persistiendo en Postgres (`orders`/`messages`) en vez de archivos JSON.
  Hecho cuando: una conversación de prueba scripted contra el fixture produce un total y pedido final que coincide con un resultado verificado a mano.
- [ ] **Día 8 — Portar debounce/anti-baneo.** Equivalentes tenant+chat-keyed de `encolarMensaje`/`procesarBuffer`/`conColaGlobal`.
  Hecho cuando: un test con fake timers muestra que mensajes rápidos dentro de `DEBOUNCE_MS` colapsan en una sola llamada al motor.
- [ ] **Día 9 — Esqueleto del gestor de sesiones WhatsApp.** `sessionManager.js` que hace fork/stop de un proceso hijo por tenant; el hijo crea un `Client` de `whatsapp-web.js` con `LocalAuth({dataPath: data/tenants/<id>/.wwebjs_auth})`, emite `qr`/`ready`/`disconnected` vía IPC.
  Hecho cuando: arrancar un worker para un tenant semilla muestra un QR real y escanearlo con un número de WhatsApp de prueba llega a estado `connected` en la DB.
- [ ] **Día 10 — Conectar worker al motor.** El handler de `message` del worker llama a `orderEngine.processMessage` y envía la respuesta de vuelta por `whatsapp-web.js`.
  Hecho cuando: un mensaje real de WhatsApp a la sesión de prueba produce una respuesta correcta de la IA y crea una fila en `orders`.
- [ ] **Día 11 — Recuperación ante crash + re-conexión al arrancar.** Al iniciar el backend, relanzar un worker por cada tenant con `status=active`, reutilizando su carpeta de auth guardada; reinicio automático con backoff si un worker muere inesperadamente.
  Hecho cuando: matar un worker a mitad de sesión reinicia y reconecta automáticamente sin escanear un QR nuevo.
- [ ] **Día 12 — Notas de voz + import de catálogo por PDF** (menor prioridad, puede deslizarse sin bloquear días siguientes). Portar `transcribirAudio`/`generarNotaDeVoz`/`leerCatalogoDesdePDF` como funciones tenant-aware.
  Hecho cuando: una nota de voz de prueba se transcribe y responde; un PDF de prueba puebla `catalog_items`.

## Fase C — Dashboards

- [ ] **Día 13 — Dashboard dueño: lista de tenants + crear tenant.** Tabla cross-tenant (nombre/estado/conectado/plan/creado), formulario crear-tenant (crea `tenants` + primer `tenant_admin`).
  Hecho cuando: el dueño puede crear un tenant desde la UI y verlo listado con estado de conexión en vivo.
- [ ] **Día 14 — Shell del dashboard por tenant.** Nav (Pedidos/Catálogo/Conversaciones/Config/WhatsApp), todas las llamadas con tenant-scoping del Día 3, estados vacíos por sección.
  Hecho cuando: una llamada cross-tenant como `tenant_admin` devuelve 403.
- [ ] **Día 15 — Kanban de pedidos.** Portar el tablero de 5 columnas (Armando pedido → Por pagar → Comprobante enviado → Pagados → Cancelados) como componente React sobre `/api/tenant/orders`, actualización en vivo vía el hub de tiempo real.
  Hecho cuando: un pedido simulado de WhatsApp aparece en la columna correcta en segundos sin refrescar manualmente.
- [ ] **Día 16 — Editor de catálogo.** CRUD de `catalog_items` (nombre/categoría/precio/variantes/disponibilidad día-hora/activo), trigger de import por PDF.
  Hecho cuando: editar un precio en la UI cambia lo que cotiza el bot en el siguiente mensaje de prueba.
- [ ] **Día 17 — Pantalla de conexión WhatsApp + toggle IA/humano.** QR, estado de conexión, controles reconectar/desconectar, toggle global y por conversación, visor de conversaciones.
  Hecho cuando: un tenant nuevo pasa de "sin sesión" a "conectado, escaneado, viendo mensajes en vivo" completamente desde el dashboard.
- [ ] **Día 18 — Reservas, promociones, config de negocio.** Portar lista de `reservas` (marcar atendida), editor de promociones, editor de info de negocio en DB reemplazando `empresa.md`.
  Hecho cuando: editar info de negocio en la UI cambia el system prompt vivo en el siguiente mensaje.

## Fase D — Landing/signup + billing stub

- [ ] **Día 19 — Landing pública.** Ruta `/` sin login: propuesta de valor, tiers de precio (~$95-250/mes), CTA de signup clara.
  Hecho cuando: accesible sin login, CTA visible.
- [ ] **Día 20 — Flujo de signup.** Formulario público (nombre de negocio, contacto, número WhatsApp, interés de plan) crea un tenant `trial` + usuario `tenant_admin`, notifica al dueño.
  Hecho cuando: enviar el formulario crea un tenant trial real visible en el dashboard del dueño.
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
