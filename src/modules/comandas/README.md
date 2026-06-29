# Módulo §21 · Comandas (frontend)

Scaffolding placeholder. Estructura `index/api/ws/types/hooks/components`; **sin reglas de
negocio**. El contrato vive en el OpenSpec del backend (`../osiris-menu-be/openspec/`).

- HTTP por `src/api/` (apiClient centralizado). Mutaciones usan `X-Request-Id` (idempotencia).
- WS por `src/ws/` (canal lógico `comandas:<comanda_id>`).
