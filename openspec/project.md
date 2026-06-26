# osiris-menu-fe · Asiringui

Frontend del sistema operativo integral del restaurante-cervecería Asiringui, en Cuenca, Ecuador. Apertura prevista Q3 2026. Local familiar de ~60 plazas, operación martes a domingo.

El backend vive en el repo `osiris-menu-be`. **Las decisiones de negocio del sistema son únicas y se documentan ahí.** El frontend las consume, no las redefine. Para tener una copia local de las specs de dominio, correr `scripts/sync-domain-specs.sh`.

## Qué construye este repo

Una aplicación web responsive (PWA) en código único que sirve:

- **Tablet del Mesero**: gestión de comandas, layout del salón.
- **Tablet fija de cocina**: vista operativa de cocina.
- **Tablet fija de barra**: vista operativa de barra.
- **Computadora del Cajero/Barman**: cobro, facturación, cierre de caja.
- **Computadora del Admin Socio / Admin Contable**: dashboards, configuración.
- **Sitio público QR del cliente**: carta digital y formulario de reservas.

**Sin app móvil nativa.** Diseño responsive sobre un solo código base.

## Stack obligatorio

| Capa | Tecnología | Nota |
|---|---|---|
| Lenguaje | TypeScript | `strict: true` obligatorio. |
| Framework | React 18+ | Funcional con hooks, sin clases. |
| Build | Vite | |
| Routing | React Router | |
| Estado servidor | TanStack Query | Obligatorio para datos del backend. |
| Estado UI | useState / useReducer locales | Zustand solo si se necesita global. |
| Estilos | Tailwind CSS | Utility-first. |
| Componentes base | shadcn/ui | Sobre Tailwind. |
| Forms | React Hook Form + Zod | Obligatorio para todo form. |
| HTTP | fetch o ky | |
| Iconos | lucide-react | |
| Testing | Vitest + Playwright | Unit + e2e. |

No introducir librerías nuevas sin justificación. **No** instalar Ant Design, Material UI, Redux, MobX, ni CSS-in-JS runtime.

## Restricciones técnicas críticas

- **Sin localStorage para datos críticos del negocio.** Para los hasta 50 cambios pendientes offline del Mesero, usar **IndexedDB** con un wrapper simple.
- **PWA como mejora de experiencia, no como operación sin servidor.** El frontend siempre requiere conectividad a la red local del restaurante para hablar con el backend. Lo que el dominio llama "offline" significa "sin internet, pero con red local funcional".
- **Diseño responsive obligatorio**: misma base de código para tablets 10" (mesero), tablets fijas 12-13" (cocina/barra), computadoras de caja/admin, y móviles de clientes.
- **Operación táctil**: todos los flujos operativos deben funcionar sin teclado físico. Botones grandes, bien separados, soportando manos mojadas o con guantes.
- **Modo kiosko** en las tablets fijas: deshabilitar context menu, prevenir navegación accidental, fullscreen.

## Principios no negociables (los que más impactan al frontend)

De los 10 principios del dominio (documentados en backend):

- **Trazabilidad total**: cada acción del operador en la UI dispara un evento al backend con contexto suficiente para que se registre completo.
- **Transparencia con el operador**: el operador siempre ve el estado real. Indicador semafórico de conectividad con el SRI visible permanentemente. Estado de cola, tiempos, alertas siempre presentes.
- **Resiliencia operativa**: ante pérdida de conexión con el backend, la UI no rompe. Los últimos datos quedan visibles, los cambios pendientes se encolan en IndexedDB, se reintentan al reconectar con idempotencia garantizada.
- **Mínimo privilegio**: la UI esconde acciones que el rol del usuario no puede ejecutar. No depender solo de validación en backend.
- **Evolución sin migración**: el diseño del MVP contempla extensiones de Fase 2 (auto-pedido QR del cliente, WhatsApp Business API).

## Roles del sistema

Siete roles. La UI se adapta:

| Rol | Vista principal |
|---|---|
| **Super Admin** | Acceso técnico, configuración avanzada. |
| **Admin Socio** | Dashboards, autorizaciones Nivel 4, gestión de empleados. |
| **Admin Contable** | Gestión fiscal, reportes contables. |
| **Cajero / Barman** | Caja + vista operativa de barra. |
| **Mesero** | Vista del salón, tablet portátil. |
| **Chef** | Vista operativa de cocina (PIN compartido con Ayudante). |
| **Ayudante** | Misma sesión compartida con Chef. |

Niveles de autorización: 1 (cualquier autenticado), 2, 3, 4 (Admin Socio o Super Admin). Acciones que requieren autorización individual mientras la sesión es compartida (Nivel 2 en tablet de cocina, por ejemplo) exigen **re-autenticación con PIN personal** en el momento.

## Convenciones de código

- **TypeScript strict**. Nada de `any` salvo justificado en línea con razón.
- **Componentes funcionales** con hooks. Nombres en PascalCase.
- **Hooks personalizados** con prefijo `use`. Un archivo por hook si no es trivial.
- **Archivos**: kebab-case para no-componentes (`use-mesa-state.ts`), PascalCase para componentes (`MesaCard.tsx`).
- **Tailwind utility-first**. Abstraer a clase reutilizable solo cuando se repite 3+ veces.
- **Forms** siempre React Hook Form + Zod. No estado manual con useState para forms.
- **Async**: siempre TanStack Query para datos del backend. No fetch directo en componentes.
- **Commits** convencionales.

## Convenciones de comunicación con el backend

- **Base URL** en `VITE_API_URL`. Default en dev: `http://localhost:8000`.
- **OpenAPI**: el backend lo genera. Recomendado generar tipos TypeScript automáticos con `openapi-typescript` para evitar drift de contratos.
- **Autenticación**: cookie httpOnly seteada por backend al login. Frontend NO maneja el token directamente. NO en localStorage. NO en sessionStorage.
- **Errores** del backend: `{ "error": { "code": string, "message": string, "details"?: object } }`. Cliente HTTP los propaga como excepciones tipadas.
- **Idempotencia**: incluir header `X-Request-Id` (UUID v4 generado en cliente) en todo request mutador. Permite reintento seguro tras reconexión offline.

## WebSockets

El cliente WS personalizado vive en `src/ws/` con:
- Reconexión automática con backoff exponencial.
- Heartbeat.
- Queue de eventos pendientes durante reconexión.

Canales del backend:
- `mesas` — cambios de estado de mesa y zona.
- `comandas:<comanda_id>` — cambios de la comanda específica abierta.
- `cocina` — ítems con ruteo cocina, no terminales.
- `barra` — ítems con ruteo barra, no terminales.
- `connectivity` — estado del semáforo de conectividad con SRI.

**Latencia objetivo**: <500 ms desde evento en cliente origen hasta render en cliente destino, en red local.

## Estructura de carpetas del código

```
src/
├── main.tsx
├── App.tsx
├── routes/                ← React Router routes
├── views/                 ← vistas top-level por rol
│   ├── mesero/
│   ├── cocina/
│   ├── barra/
│   ├── caja/
│   ├── admin/
│   └── publico/
├── modules/               ← lógica por módulo de negocio
│   ├── mesas/             ← §20
│   ├── comandas/          ← §21
│   └── cocina-barra/      ← §22
├── components/
│   └── ui/                ← shadcn/ui components
├── hooks/                 ← hooks compartidos
├── api/                   ← cliente HTTP del backend
├── ws/                    ← cliente WebSocket
├── auth/                  ← contexto de autenticación
├── lib/                   ← utilidades, helpers
└── types/                 ← tipos TypeScript del dominio
```

Cada módulo en `src/modules/<nombre>/` tiene: `api.ts` (hooks de TanStack Query), `ws.ts` (suscripciones WS), `types.ts`, `hooks/`, `components/`.

## Reglas de seguridad — no negociables

- **NUNCA** poner credenciales, tokens, API keys en código ni en variables `VITE_*` (terminan en el bundle). `VITE_*` solo para valores no sensibles (URL del backend, feature flags).
- **NUNCA** usar `dangerouslySetInnerHTML` salvo con sanitización (DOMPurify) y razón documentada.
- **NUNCA** loguear contraseñas, tokens, datos personales completos en consola.
- **Sesión** en cookie httpOnly del backend, nunca accesible desde JavaScript.
- **Validación**: todos los forms validan con Zod antes de submit. El backend revalida — la validación frontend es UX, no seguridad.

## Decisiones de dominio

Las decisiones N-XX (negocio), T-XX (técnico) y D-XX (post-discovery funcionales) viven en el repo backend, archivo `openspec/decisions.md`. Para tener una copia local accesible:

```bash
scripts/sync-domain-specs.sh ../osiris-menu-be
```

Esto deja una copia en `docs/domain-from-be/`. Sincronizar antes de trabajar en una vista que dependa de algún módulo de dominio.

Las D-XX más relevantes para el frontend (resumen):

| ID | Asunto | Impacto en UI |
|---|---|---|
| D-01 | Modelo híbrido de inventario | Indicar visualmente reserva teórica vs consumo confirmado en vista operativa de cocina/barra. |
| D-02 | Matriz de anulación por rol y estado | UI esconde el botón Anular según rol activo y estado del ítem. |
| D-03 | Combos con componentes | Vista de cocina/barra muestra referencia al combo padre y progreso consolidado. |
| D-04 | QR como identificador permanente | Admin: generación y reimpresión de QR conservan el mismo identificador. |
| D-05 | Verificación explícita de reserva | Flujo de apertura sobre mesa Reservada: modal de verificación obligatorio. |
| D-06 | Estado "En cierre" de zona | Mostrar zona en estado intermedio con tinte visual claro; mesas no aceptan nuevas comandas. |
| D-07 | Por limpiar → Libre configurable | Botón "Marcar libre" visible para cualquier operador autenticado, si la política lo permite. |
| D-08 | Siete reglas de traslado | Validar en cliente las precondiciones antes de enviar al backend (el backend revalida). |
| D-09 | División de cuenta con políticas fiscales | Flujo de división con propina por cuenta, descuentos prorrateados, IVA por cuenta. |
| D-10a | Estado Rechazado | Botón "Rechazar" en ítems Entregados visible solo a Cajero/Admin Socio. |

## Glosario

Términos canónicos del dominio. Glosario completo en `docs/domain-from-be/glossary.md` (después de sync). Los más críticos para frontend:

- **Tablet del Mesero** — dispositivo móvil 10" del personal de sala.
- **Tablet fija de cocina / barra** — dispositivo 12-13" montado fijo, en modo kiosko.
- **Vista operativa de cocina / barra** — vista del frontend filtrada por ruteo (no usar "pantalla" como genérico).
- **Personal de cocina o barra** — Chef + Ayudante (cocina) o Barman (barra).
- **Comanda** — pedido de un grupo de clientes a una o más mesas.
- **Grupo de Mesas** — 2+ mesas con una sola comanda compartida.
- **Combo** — producto vendible compuesto por componentes con ruteo independiente.
- **Offline** — sin internet pero con red local funcional.

## Cuándo invocar Claude Code

- Para una vista nueva: leer primero la spec del módulo backend correspondiente (en `docs/domain-from-be/reference-specs/`), luego pedir scaffolding.
- Para un componente reutilizable: pedir variantes y estados (loading, error, empty) en el primer paso.
- Para integrar un endpoint nuevo: pedir el hook de TanStack Query con manejo de error explícito.
- Para WebSockets: pedir el canal con manejo de reconexión y test.

## Qué NO hacer

- No introducir Redux, MobX, Ant Design, Material UI.
- No usar CSS-in-JS runtime (styled-components, emotion).
- No usar localStorage ni sessionStorage para datos críticos del negocio.
- No mantener estado del servidor en estado UI duplicado. Usar TanStack Query como única fuente.
- No redefinir reglas de negocio en frontend. Si la UI parece necesitar una regla nueva, ir al backend y abrir un cambio ahí primero.
- No usar mocks del backend en producción.
- No commitear archivos `.env.local` ni datos reales de operación.

## Referencias rápidas

- Decisiones detalladas: `docs/domain-from-be/decisions.md` (sincronizado desde backend)
- Glosario extendido: `docs/domain-from-be/glossary.md`
- Specs de referencia previas al desarrollo: `docs/domain-from-be/reference-specs/`
- Convenciones específicas del repo (comandos `npm`, estructura interna): `CLAUDE.md` (raíz)
