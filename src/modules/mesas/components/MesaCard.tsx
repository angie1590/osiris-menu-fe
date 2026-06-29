import { Users } from "lucide-react";

import type { Mesa } from "../types";
import { MesaEstadoBadge } from "./MesaEstadoBadge";

interface MesaCardProps {
  mesa: Mesa;
  onClick?: (mesa: Mesa) => void;
}

/**
 * Tarjeta de mesa. Presentacional: muestra el estado provisto por el backend (no decide
 * reglas). Indicador de grupo cuando `grupo_id` está presente.
 */
export function MesaCard({ mesa, onClick }: MesaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(mesa)}
      className="flex flex-col items-start gap-1 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-semibold">{mesa.numero_visible}</span>
        {mesa.grupo_id ? (
          <Users data-testid="grupo-indicator" aria-label="En grupo" className="h-4 w-4 text-sky-600" />
        ) : null}
      </div>
      <MesaEstadoBadge estado={mesa.estado} />
      <span className="text-xs text-slate-500">Capacidad: {mesa.capacidad}</span>
    </button>
  );
}
