import { apiClient } from "@/api/apiClient";

import type { EstadoMesa, GrupoMesas, Mesa, QrPayload, Zona } from "./types";

// Todo HTTP pasa por el cliente central; las mutaciones llevan X-Request-Id (idempotencia).

const ZONAS = "/api/v1/zonas";
const MESAS = "/api/v1/mesas";
const GRUPOS = "/api/v1/grupos";

export interface ZonaInput {
  nombre: string;
  descripcion?: string | null;
  aforo_max?: number;
  orden_visualizacion?: number;
}

export interface MesaInput {
  zona_id: string;
  numero_visible: string;
  capacidad?: number;
}

// ---- Zonas ----

export async function listarZonas(): Promise<Zona[]> {
  return (await apiClient.get<Zona[]>(ZONAS)).data;
}

export async function crearZona(input: ZonaInput): Promise<Zona> {
  return (await apiClient.post<Zona>(ZONAS, input)).data;
}

export async function cerrarZona(id: string, motivo: string): Promise<Zona> {
  return (await apiClient.post<Zona>(`${ZONAS}/${id}/cerrar`, { motivo })).data;
}

export async function activarZona(id: string): Promise<Zona> {
  return (await apiClient.post<Zona>(`${ZONAS}/${id}/activar`)).data;
}

export async function desactivarZona(id: string): Promise<Zona> {
  return (await apiClient.post<Zona>(`${ZONAS}/${id}/desactivar`)).data;
}

// ---- Mesas ----

export async function listarMesas(params?: {
  zona_id?: string;
  estado?: EstadoMesa;
}): Promise<Mesa[]> {
  return (await apiClient.get<Mesa[]>(MESAS, { params })).data;
}

export async function crearMesa(input: MesaInput): Promise<Mesa> {
  return (await apiClient.post<Mesa>(MESAS, input)).data;
}

export async function marcarLibre(id: string): Promise<Mesa> {
  return (await apiClient.post<Mesa>(`${MESAS}/${id}/marcar-libre`)).data;
}

export async function generarQr(id: string): Promise<QrPayload> {
  return (await apiClient.post<QrPayload>(`${MESAS}/${id}/qr`)).data;
}

export async function bajaMesa(id: string): Promise<Mesa> {
  return (await apiClient.delete<Mesa>(`${MESAS}/${id}`)).data;
}

// ---- Grupos (unir / separar) ----

export async function crearGrupo(mesas_ids: string[]): Promise<GrupoMesas> {
  return (await apiClient.post<GrupoMesas>(GRUPOS, { mesas_ids })).data;
}

export async function disolverGrupo(id: string): Promise<GrupoMesas> {
  return (await apiClient.post<GrupoMesas>(`${GRUPOS}/${id}/disolver`)).data;
}
