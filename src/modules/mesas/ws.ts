import type { Channel } from "@/types/ws";

// Canal lógico del módulo §20 → ruta física /ws/mesas.
export const MESAS_CHANNEL: Channel = "mesas";

export type MesaEventType =
  | "mesa.estado_cambiado"
  | "zona.estado_cambiado"
  | "grupo.creado"
  | "grupo.actualizado"
  | "grupo.disuelto";

export interface MesaEvent {
  type: MesaEventType;
  usuario_id?: string | null;
  timestamp?: string;
  [key: string]: unknown;
}
