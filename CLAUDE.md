# Asiringui · osiris-menu-fe

Sistema operativo integral del restaurante-cervecería Asiringui, en Cuenca, Ecuador. Este repo contiene el **frontend** del sistema. El backend vive en el repo `osiris-menu-be`.

## Qué construye este repo

Aplicación web responsive (PWA) que sirve:

- **Tablet del Mesero**: gestión de comandas, layout del salón, atención al cliente.
- **Tablet fija de cocina**: vista operativa de cocina, transiciones de estado de ítems.
- **Tablet fija de barra**: vista operativa de barra, similar a cocina.
- **Computadora de Cajero / Barman**: cobro, facturación, cierre de caja.
- **Computadora de Admin Socio / Admin Contable**: dashboards, reportes, configuración.
- **Sitio público QR del cliente**: carta digital, formulario de reservas.

Un único código base React con vistas responsive y autorizaciones por rol. **Sin app móvil nativa.**

## Stack obligatorio

- **Lenguaje**: TypeScript estricto (`strict: true` en tsconfig).
- **Framework**: React 18+
- **Build**: Vite
- **Routing**: React Router
- **Estado de servidor**: TanStack Query (React Query)
- **Estado UI**: useState/useReducer locales. Si se necesita estado global, Zustand (no Redux).
- **Estilos**: Tailwind CSS (utility-first). Componentes shadcn/ui como base.
- **Forms**: React Hook Form + Zod para validación.
- **WebSockets**: API nativa del navegador con un cliente wrapper propio.
- **HTTP**: fetch nativo o `ky` si necesitamos retry/timeouts.
- **Testing**: Vitest para unit, Playwright para e2e.
- **Linter / formatter**: ESLint + Prettier configurados.
- **Iconos**: lucide-react.

No introducir librerías nuevas sin justificación explícita.

## Restricciones técnicas críticas

- **Sin localStorage para datos críticos**: la operación offline NO usa localStorage como backup principal. Datos críticos se sincronizan al backend siempre. Para los 50 cambios pendientes offline del Mesero (NFR-21-05), usar **IndexedDB** vía wrapper simple.
- **PWA**: el frontend se instala como PWA solo como mejora de experiencia. **No habilita operación sin servidor**: el frontend siempre requiere conectividad a la red local del restaurante para hablar con el backend. Lo que llamamos "offline" en el sistema es "sin internet pero con red local funcional".
- **Diseño responsive** obligatorio: misma base de código adapta a tablets de meseros (10"), tablets fijas (12-13"), computadoras de caja y admin, y móviles de clientes.
- **Operación táctil**: todos los flujos operativos deben ser usables sin teclado físico. Botones grandes, bien separados, soportando manos mojadas o con guantes.

## Arquitectura física relevante

- El backend corre en un servidor local dentro del restaurante. Frontend lo consume vía red local (WiFi segmentada).
- Las tablets de meseros se autentican individualmente por usuario.
- Las tablets fijas de cocina y barra operan en modo **kiosko** con PIN compartido entre operadores.
- La computadora de caja es la misma máquina física que el servidor.

## Estructura del repo (a crear)

```
osiris-menu-fe/
├── CLAUDE.md                      ← este archivo
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
├── specs/                         ← copia de las specs relevantes del backend
│   └── (sincronizadas desde osiris-menu-be/specs/)
├── public/
│   └── icons/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/                    ← React Router routes
│   ├── views/                     ← vistas top-level por rol
│   │   ├── mesero/                ← layout del salón, comanda activa
│   │   ├── cocina/                ← vista operativa de cocina
│   │   ├── barra/                 ← vista operativa de barra
│   │   ├── caja/                  ← cobro, facturación
│   │   ├── admin/                 ← dashboards, configuración
│   │   └── publico/               ← carta QR, reservas web
│   ├── modules/                   ← lógica por módulo de negocio
│   │   ├── mesas/                 ← §20
│   │   ├── comandas/              ← §21
│   │   └── cocina-barra/          ← §22
│   ├── components/                ← componentes UI compartidos
│   │   └── ui/                    ← shadcn/ui components
│   ├── hooks/                     ← hooks compartidos
│   ├── api/                       ← cliente HTTP del backend
│   ├── ws/                        ← cliente WebSocket
│   ├── auth/                      ← contexto de autenticación
│   ├── lib/                       ← utilidades, helpers
│   └── types/                     ← tipos TypeScript del dominio
└── tests/
    ├── unit/
    └── e2e/
```

Cada módulo dentro de `src/modules/` tiene:

```
modules/<nombre>/
├── index.ts
├── api.ts             ← llamadas al backend (TanStack Query hooks)
├── ws.ts              ← suscripciones WebSocket del módulo
├── types.ts           ← tipos TypeScript locales
├── hooks/             ← hooks de dominio (ej. useMesaState)
└── components/        ← componentes específicos del módulo
```

## Principios no negociables

Mismos 10 principios que el backend (ver Product Vision Parte I §7). Los que tienen impacto directo en el frontend:

- **Trazabilidad total**: cada acción del operador en la UI dispara un evento al backend con contexto suficiente para que el log del backend lo registre completo.
- **Transparencia con el operador**: el operador siempre ve el estado real del sistema. Indicador semafórico de conectividad con backend visible permanentemente. Estado de cola, tiempos, alertas siempre presentes.
- **Resiliencia operativa**: ante pérdida de conexión con el backend, la UI no rompe. Los últimos datos quedan visibles, los cambios pendientes se encolan en IndexedDB, y se reintentan al reconectar con idempotencia garantizada.
- **Mínimo privilegio**: la UI esconde acciones que el rol del usuario no puede ejecutar. No depender solo de validación en backend.

## Roles del sistema

Siete roles. La UI se adapta:

- **Super Admin** → acceso técnico, configuración avanzada.
- **Admin Socio** → dashboards, autorizaciones nivel 4, gestión de empleados.
- **Admin Contable** → gestión fiscal, reportes contables.
- **Cajero / Barman** → vista de caja + vista operativa de barra.
- **Mesero** → vista del salón, tablet portátil.
- **Chef** → vista operativa de cocina (PIN compartido con Ayudante).
- **Ayudante** → mismo PIN compartido con Chef.

## Convenciones de código

- **TypeScript**: `strict: true`. Nada de `any` salvo justificado en línea con `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- razón`.
- **Componentes React**: funcionales con hooks. No clases. Nombres en PascalCase.
- **Hooks personalizados**: prefijo `use`. Un archivo por hook si es no trivial.
- **Archivos**: kebab-case para archivos no-componente (`use-mesa-state.ts`). PascalCase para componentes (`MesaCard.tsx`).
- **Tailwind**: utility-first. Solo abstraer a clase reutilizable cuando se repite 3+ veces. Componentes shadcn/ui como base estética.
- **Forms**: siempre React Hook Form + Zod schema. No estado manual con useState para forms.
- **Async**: usar TanStack Query para todo lo que viene del backend. No fetch directo en componentes.
- **Imports**: organizados por: react → terceros → @/ aliases → relativos.
- **Commits**: convencionales (`feat:`, `fix:`, `chore:`, `style:`, `test:`).

## Reglas de seguridad — no negociables

- **NUNCA** poner credenciales, tokens, API keys en código ni en variables `VITE_*` que terminan en el bundle. Solo usar `VITE_*` para valores no sensibles (URL del backend, feature flags).
- **NUNCA** usar `dangerouslySetInnerHTML` salvo con sanitización (DOMPurify) y razón documentada.
- **NUNCA** loguear contraseñas, tokens, datos personales completos en consola.
- **JWT / sesión**: el token de sesión vive en cookie httpOnly seteada por el backend. NO en localStorage. NO en sessionStorage.
- **Validación**: todos los forms validan con Zod antes de submit. Backend revalida — la validación frontend es UX, no seguridad.
- **CSP**: configurar Content Security Policy estricta en el servidor que sirve el frontend.

## WebSockets

El backend emite eventos. El frontend se suscribe vía canales por contexto:

- Canal `mesas`: cambios de estado de mesa.
- Canal `comandas:<comanda_id>`: cambios de la comanda específica abierta.
- Canal `cocina`: ítems con ruteo cocina.
- Canal `barra`: ítems con ruteo barra.
- Canal `connectivity`: estado de conectividad con SRI (semáforo).

Cliente WS personalizado en `src/ws/` con:

- Reconexión automática con backoff exponencial.
- Heartbeat.
- Queue de eventos pendientes durante reconexión.

## Cómo trabajar con las specs

Las specs definitivas viven en `osiris-menu-be/specs/`. Para mantenerlas accesibles desde este repo:

**Opción A (recomendada al inicio)**: copiar manualmente al iniciar sesiones de trabajo importantes. Hacer un script `scripts/sync-specs.sh` que sincronice desde un path local.

**Opción B**: cuando ambos repos estén en GitHub, usar submódulo git apuntando a `osiris-menu-be/specs/` o a un repo de specs separado.

Lo importante: el frontend **NO redefine reglas de negocio**. Solo las consume. Si una regla parece ambigua, leer la spec en backend o levantar issue.

## Cómo correr

```bash
# Setup inicial (una vez)
npm install
cp .env.example .env.local        # configurar VITE_API_URL

# Desarrollo
npm run dev                       # Vite dev server en :5173

# Tests
npm run test                      # Vitest unit
npm run test:e2e                  # Playwright e2e (necesita backend corriendo)

# Lint / format
npm run lint
npm run format

# Build producción
npm run build
npm run preview                   # preview del build
```

## Cuándo invocar a Claude Code

- Para una vista nueva: leer la spec del módulo backend correspondiente, luego pedir scaffolding de la vista.
- Para un componente reutilizable: pedir variantes y estados (loading, error, empty) en el primer paso.
- Para integrar un endpoint nuevo: pedir el hook de TanStack Query con manejo de error explícito.
- Para WebSockets: pedir el canal con manejo de reconexión y test.

## Qué NO hacer

- No introducir Redux ni MobX. Si necesitas estado global, Zustand.
- No instalar librerías UI completas (no Ant Design, no Material UI). Stack es Tailwind + shadcn/ui.
- No usar CSS-in-JS runtime (styled-components, emotion).
- No usar localStorage para datos críticos del negocio.
- No depender de servicios cloud para la operación crítica de la app (analíticas, error tracking solo si self-hosted).
- No mantener estado del servidor (datos del backend) en estado UI duplicado. Usar TanStack Query como única fuente de datos del servidor.

## Comunicación con el backend

- **Base URL**: `VITE_API_URL`, por defecto `http://localhost:8000` en dev.
- **OpenAPI**: el backend genera schema OpenAPI. Considerar generar tipos TypeScript automáticos con `openapi-typescript` para mantener sincronía.
- **Autenticación**: cookie httpOnly de sesión seteada al login. Frontend no maneja el token directamente.
- **Errores**: el backend retorna errores estructurados (`{ error: { code, message, details? } }`). Cliente HTTP propaga estos errores como excepciones tipadas.

## Glosario rápido

Mismo glosario que backend. Términos canónicos:

- **Tablet del Mesero**: dispositivo móvil 10" del personal de sala.
- **Tablet fija de cocina / barra**: dispositivo 12-13" montado fijo.
- **Vista operativa de cocina / barra**: vista del frontend filtrada por ruteo.
- **Personal de cocina o barra**: Chef + Ayudante (cocina) o Barman (barra).

Glosario extendido: `specs/00-base/glossary.md`.
