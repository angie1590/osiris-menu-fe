/** Canales lógicos del glosario, mapeados a rutas físicas `/ws/...` por el cliente WS. */
export type Channel = "mesas" | "cocina" | "barra" | "connectivity" | `comandas:${string}`;

const COMANDA_PREFIX = "comandas:";

export function channelPath(channel: Channel): string {
  if (channel.startsWith(COMANDA_PREFIX)) {
    return `/ws/comandas/${channel.slice(COMANDA_PREFIX.length)}`;
  }
  return `/ws/${channel}`;
}
