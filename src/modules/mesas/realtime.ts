import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { ReconnectingChannel } from "@/ws/wsClient";

import { MESAS_CHANNEL, type MesaWebSocketEvent, isMesaWebSocketEvent } from "./ws";

// Prefijo de las queries del módulo (zonas + mesas). Invalidar por prefijo refresca ambas.
const MESAS_QUERY_PREFIX = ["mesas"] as const;

/**
 * Handler de eventos WS de §20. Cada evento conocido invalida las queries relevantes de
 * TanStack Query (zonas, mesas y, por prefijo, grupos derivados). No descarta eventos
 * válidos; los eventos desconocidos se filtran antes con `isMesaWebSocketEvent`.
 */
export function handleMesaEvent(queryClient: QueryClient, event: MesaWebSocketEvent): void {
  switch (event.type) {
    case "mesa.estado_cambiado":
    case "mesa.desactivada":
    case "mesa.reactivada":
    case "zona.estado_cambiado":
    case "grupo.creado":
    case "grupo.actualizado":
    case "grupo.disuelto":
      void queryClient.invalidateQueries({ queryKey: MESAS_QUERY_PREFIX });
      break;
    default: {
      // Exhaustividad: si se agrega un MesaEventType nuevo, TS obliga a manejarlo aquí.
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

/**
 * Consumidor preparado del canal `mesas`. Aún no se monta en las vistas (el refresco
 * operativo de §20 funciona por queries de TanStack Query); queda listo para suscripción.
 * Al recibir un evento conocido, invalida las queries de §20.
 */
export function useMesasRealtime(): void {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = new ReconnectingChannel(MESAS_CHANNEL, (data) => {
      if (isMesaWebSocketEvent(data)) {
        handleMesaEvent(queryClient, data);
      }
    });
    channel.connect();
    return () => channel.close();
  }, [queryClient]);
}
