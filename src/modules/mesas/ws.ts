import type { Channel } from "@/types/ws";

import type { EstadoMesa, EstadoZona } from "./types";

// Canal lógico del módulo §20 → ruta física /ws/mesas.
export const MESAS_CHANNEL: Channel = "mesas";

export type MesaEventType =
  | "mesa.estado_cambiado"
  | "mesa.desactivada"
  | "mesa.reactivada"
  | "zona.estado_cambiado"
  | "grupo.creado"
  | "grupo.actualizado"
  | "grupo.disuelto";

/** Campos comunes a todos los eventos del canal `mesas` (ver backend `events.py`). */
interface BaseMesaEvent {
  usuario_id?: string | null;
  timestamp?: string;
}

export interface MesaEstadoCambiadoEvent extends BaseMesaEvent {
  type: "mesa.estado_cambiado";
  mesa_id: string;
  estado_anterior: EstadoMesa | null;
  estado_nuevo: EstadoMesa;
  comanda_id?: string | null;
}

/** Payload backend: `{ type, mesa_id, activa, usuario_id, timestamp }`. */
export interface MesaDesactivadaEvent extends BaseMesaEvent {
  type: "mesa.desactivada";
  mesa_id: string;
  activa: boolean;
}

/** Payload backend: `{ type, mesa_id, activa, usuario_id, timestamp }`. */
export interface MesaReactivadaEvent extends BaseMesaEvent {
  type: "mesa.reactivada";
  mesa_id: string;
  activa: boolean;
}

export interface ZonaEstadoCambiadoEvent extends BaseMesaEvent {
  type: "zona.estado_cambiado";
  zona_id: string;
  estado_anterior: EstadoZona | null;
  estado_nuevo: EstadoZona;
}

export interface GrupoEvent extends BaseMesaEvent {
  type: "grupo.creado" | "grupo.actualizado" | "grupo.disuelto";
  grupo_id: string;
  mesas_ids: string[];
  comanda_id?: string | null;
}

/** Union discriminada por `type` de todos los eventos del canal `mesas`. */
export type MesaWebSocketEvent =
  | MesaEstadoCambiadoEvent
  | MesaDesactivadaEvent
  | MesaReactivadaEvent
  | ZonaEstadoCambiadoEvent
  | GrupoEvent;

const KNOWN_TYPES: ReadonlySet<MesaEventType> = new Set([
  "mesa.estado_cambiado",
  "mesa.desactivada",
  "mesa.reactivada",
  "zona.estado_cambiado",
  "grupo.creado",
  "grupo.actualizado",
  "grupo.disuelto",
]);

/** Type guard: reconoce un mensaje del canal como evento `mesas` tipado conocido. */
export function isMesaWebSocketEvent(data: unknown): data is MesaWebSocketEvent {
  if (typeof data !== "object" || data === null || !("type" in data)) {
    return false;
  }
  const type = (data as { type: unknown }).type;
  return typeof type === "string" && KNOWN_TYPES.has(type as MesaEventType);
}
