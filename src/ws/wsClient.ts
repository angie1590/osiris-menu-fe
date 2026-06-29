/**
 * Cliente WebSocket base (D-f). Todo WebSocket pasa por src/ws/.
 *
 * Soporta reconexión automática con backoff exponencial y heartbeat. Sólo transporte;
 * la lógica por canal llega con cada módulo. Sin Socket.IO.
 */

import { type Channel, channelPath } from "@/types/ws";

export function wsUrl(channel: Channel): string {
  const base = import.meta.env.VITE_API_URL ?? window.location.origin;
  const url = new URL(channelPath(channel), base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export interface ReconnectingChannelOptions {
  baseDelayMs?: number;
  maxDelayMs?: number;
  heartbeatMs?: number;
}

export class ReconnectingChannel {
  private socket?: WebSocket;
  private closedByUser = false;
  private attempt = 0;
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly heartbeatMs: number;

  constructor(
    private readonly channel: Channel,
    private readonly onMessage: (data: unknown) => void,
    options: ReconnectingChannelOptions = {},
  ) {
    this.baseDelayMs = options.baseDelayMs ?? 1_000;
    this.maxDelayMs = options.maxDelayMs ?? 30_000;
    this.heartbeatMs = options.heartbeatMs ?? 25_000;
  }

  connect(): void {
    this.closedByUser = false;
    const socket = new WebSocket(wsUrl(this.channel));
    this.socket = socket;

    socket.onopen = () => {
      this.attempt = 0;
      this.startHeartbeat();
    };
    socket.onmessage = (event) => {
      try {
        this.onMessage(JSON.parse(event.data));
      } catch {
        this.onMessage(event.data);
      }
    };
    socket.onclose = () => {
      this.stopHeartbeat();
      if (!this.closedByUser) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    const delay = Math.min(this.maxDelayMs, this.baseDelayMs * 2 ** this.attempt);
    this.attempt += 1;
    setTimeout(() => this.connect(), delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => this.send({ type: "ping" }), this.heartbeatMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== undefined) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  send(data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(typeof data === "string" ? data : JSON.stringify(data));
    }
  }

  close(): void {
    this.closedByUser = true;
    this.stopHeartbeat();
    this.socket?.close();
  }
}
