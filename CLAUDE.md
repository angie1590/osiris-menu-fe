CLAUDE.md · osiris-menu-fe

Guía mínima para trabajar el frontend de osiris-menu.

Este repo no tiene el OpenSpec principal. El OpenSpec canónico vive en el backend:

../osiris-menu-be/openspec/

Antes de implementar cualquier vista, flujo o regla, leer en el backend:

../osiris-menu-be/openspec/project.md
../osiris-menu-be/openspec/decisions.md
../osiris-menu-be/openspec/glossary.md
../osiris-menu-be/openspec/reference-specs/

No duplicar reglas de negocio en este archivo. No inventar reglas desde el frontend.

Regla principal

El frontend se construye simultáneamente con el backend desde el OpenSpec único de osiris-menu-be.

Si una regla no está clara:

1. No resolverla en componentes.
2. Revisar OpenSpec.
3. Si sigue ambigua, pedir decisión nueva D-XX.
4. Solo implementar cuando el contrato esté claro.

Stack obligatorio

Usar el mismo stack y estilo visual de osiris-inventario-fe:

* React 19
* TypeScript estricto
* Vite
* React Router DOM 7
* TanStack Query 5
* Axios
* Tailwind CSS 4
* shadcn/ui sobre Radix UI
* React Hook Form
* Zod
* lucide-react
* date-fns
* Recharts
* Vitest
* Testing Library
* Playwright
* Docker
* Docker Compose

No usar Redux, MobX, Material UI, Ant Design, Bootstrap, styled-components ni emotion.

Identidad visual

La UI debe sentirse como parte de la misma familia visual de Osiris Inventario.

Reglas:

* Interfaz limpia, moderna y elegante.
* Evitar blanco puro y negro puro como base dominante.
* Usar componentes reutilizables.
* Mantener consistencia en botones, inputs, selects, modales, tablas, toasts y errores.
* Formularios con React Hook Form + Zod.
* Campos obligatorios con *.
* Errores visibles, claros y accionables.
* Acciones críticas con confirmación.
* Operación táctil prioritaria para tablets.

Docker

Este frontend se levanta desde el docker-compose.yml raíz del workspace, no desde un compose propio.

Comando principal desde la carpeta raíz:

docker compose up --build

URL local:

http://localhost:5173

Backend local:

http://localhost:8000

Variables permitidas:

VITE_API_URL=http://localhost:8000
VITE_API_PROXY_TARGET=http://api:8000

Nunca poner secretos en variables VITE_*.

Dockerfile esperado

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV VITE_API_PROXY_TARGET=http://api:8000
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

Estructura recomendada

src/
├── main.tsx
├── App.tsx
├── routes/
├── views/
│   ├── mesero/
│   ├── cocina/
│   ├── barra/
│   ├── caja/
│   ├── admin/
│   └── publico/
├── modules/
│   ├── mesas/
│   ├── comandas/
│   └── cocina-barra/
├── components/
│   └── ui/
├── hooks/
├── api/
├── ws/
├── auth/
├── lib/
└── types/

Cada módulo:

modules/<nombre>/
├── index.ts
├── api.ts
├── ws.ts
├── types.ts
├── hooks/
└── components/

Componentes reutilizables obligatorios

Centralizar en src/components/:

* Button
* Input
* Select
* Textarea
* Dialog
* AlertDialog
* Toast
* DataTable
* EmptyState
* LoadingState
* ErrorState
* PageHeader
* StatusBadge
* ConnectivityIndicator
* ConfirmActionDialog

No duplicar componentes visuales por vista.

API

Todo HTTP pasa por src/api/.

Usar Axios centralizado.

Reglas:

* baseURL desde VITE_API_URL.
* withCredentials si el backend usa cookie httpOnly.
* No hacer fetch directo en componentes.
* Errores normalizados.
* TanStack Query para datos de servidor.
* Mutations para escrituras.
* Invalidar queries relacionadas después de mutaciones exitosas.

WebSockets

Todo WebSocket pasa por src/ws/.

Canales esperados:

* mesas
* comandas:<comanda_id>
* cocina
* barra
* connectivity

El cliente debe soportar:

* Reconexión automática.
* Backoff exponencial.
* Heartbeat.
* Estado de conectividad visible.
* Integración con TanStack Query.
* Sin Socket.IO.

Offline operativo

En este sistema, “offline” significa sin internet externo, pero con red local funcional.

Reglas:

* No operar sin backend local.
* No usar localStorage para datos críticos.
* No guardar tokens en localStorage ni sessionStorage.
* Para cola temporal del Mesero, usar IndexedDB con wrapper propio.
* La tablet fija de cocina/barra no acepta transiciones durante pérdida de conexión con backend.

Seguridad

* Nunca guardar tokens en localStorage/sessionStorage.
* Nunca exponer secretos en VITE_*.
* Nunca loguear passwords, tokens ni datos personales completos.
* No usar dangerouslySetInnerHTML salvo sanitización explícita.
* La validación frontend es UX; backend revalida siempre.
* La UI no decide permisos finales; backend es autoridad.

Testing

Comandos desde la raíz del workspace:

docker compose exec web npm run lint
docker compose exec web npm run test
docker compose exec web npm run build
docker compose exec web npm run test:e2e

Criterios de terminado

Una vista o flujo está terminado solo si:

* Está respaldado por OpenSpec.
* Usa terminología del glosario.
* Usa componentes reutilizables.
* Maneja loading, error, empty y success.
* Tiene validación Zod si hay formulario.
* Usa TanStack Query para datos del backend.
* No duplica reglas de negocio.
* Funciona dentro de Docker Compose.
* Tiene tests cuando aplica.

Qué NO hacer

* No duplicar decisiones del backend.
* No copiar specs completas al frontend.
* No inventar reglas de negocio.
* No usar fetch directo en componentes.
* No crear estilos inconsistentes por pantalla.
* No agregar librerías UI completas.
* No usar Redux.
* No crear Docker Compose propio como flujo principal.
* No guardar información crítica en localStorage.