/** Tipos del módulo §20 (frontend). Valores técnicos del backend + etiquetas canónicas. */

export type EstadoZona = "activa" | "en_cierre" | "inactiva";
export type EstadoMesa = "libre" | "reservada" | "ocupada" | "por_limpiar" | "inactiva";

/** Mapeo valor técnico (API/DB) → etiqueta canónica del glosario para la UI (D-mz-8). */
export const ESTADO_ZONA_LABEL: Record<EstadoZona, string> = {
  activa: "Activa",
  en_cierre: "En cierre",
  inactiva: "Inactiva",
};

export const ESTADO_MESA_LABEL: Record<EstadoMesa, string> = {
  libre: "Libre",
  reservada: "Reservada",
  ocupada: "Ocupada",
  por_limpiar: "Por limpiar",
  inactiva: "Inactiva",
};

export interface Zona {
  id: string;
  nombre: string;
  descripcion: string | null;
  estado: EstadoZona;
  aforo_max: number;
  orden_visualizacion: number;
  created_at: string;
  updated_at: string;
}

export interface Mesa {
  id: string;
  zona_id: string;
  numero_visible: string;
  capacidad: number;
  estado: EstadoMesa;
  comanda_activa_id: string | null;
  reserva_activa_id: string | null;
  grupo_id: string | null;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface GrupoMesas {
  id: string;
  comanda_id: string | null;
  mesas_ids: string[];
  created_at: string;
  dissolved_at: string | null;
}

export interface QrPayload {
  mesa_id: string;
  url: string;
}
