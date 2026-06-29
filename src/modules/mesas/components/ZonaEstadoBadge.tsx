import { type EstadoZona, ESTADO_ZONA_LABEL } from "../types";

const ESTADO_CLASS: Record<EstadoZona, string> = {
  activa: "bg-emerald-100 text-emerald-800",
  en_cierre: "bg-amber-100 text-amber-800",
  inactiva: "bg-slate-200 text-slate-600",
};

export function ZonaEstadoBadge({ estado }: { estado: EstadoZona }) {
  return (
    <span
      data-estado={estado}
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${ESTADO_CLASS[estado]}`}
    >
      {ESTADO_ZONA_LABEL[estado]}
    </span>
  );
}
