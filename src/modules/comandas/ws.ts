import type { Channel } from "@/types/ws";

// Canal lógico por comanda: `comandas:<comanda_id>` → ruta física `/ws/comandas/{id}`.
export function comandaChannel(comandaId: string): Channel {
  return `comandas:${comandaId}`;
}
