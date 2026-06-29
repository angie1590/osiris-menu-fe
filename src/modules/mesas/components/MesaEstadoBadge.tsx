import { type EstadoMesa, ESTADO_MESA_LABEL } from "../types";

const ESTADO_CLASS: Record<EstadoMesa, string> = {
  libre: "bg-emerald-100 text-emerald-800",
  reservada: "bg-amber-100 text-amber-800",
  ocupada: "bg-rose-100 text-rose-800",
  por_limpiar: "bg-sky-100 text-sky-800",
  inactiva: "bg-slate-200 text-slate-600",
};

export function MesaEstadoBadge({ estado }: { estado: EstadoMesa }) {
  return (
    <span
      data-estado={estado}
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${ESTADO_CLASS[estado]}`}
    >
      {ESTADO_MESA_LABEL[estado]}
    </span>
  );
}
