import type { Mesa, Zona } from "../types";
import { MesaCard } from "./MesaCard";
import { ZonaEstadoBadge } from "./ZonaEstadoBadge";

interface ZonaLayoutProps {
  zona: Zona;
  mesas: Mesa[];
  onMesaClick?: (mesa: Mesa) => void;
}

export function ZonaLayout({ zona, mesas, onMesaClick }: ZonaLayoutProps) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
        {zona.nombre}
        <ZonaEstadoBadge estado={zona.estado} />
      </h2>
      {mesas.length === 0 ? (
        <p className="text-sm text-slate-500">Sin mesas en esta zona.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {mesas.map((mesa) => (
            <MesaCard key={mesa.id} mesa={mesa} onClick={onMesaClick} />
          ))}
        </div>
      )}
    </section>
  );
}
