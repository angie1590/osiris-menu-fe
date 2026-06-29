import { ZonaLayout } from "@/modules/mesas/components/ZonaLayout";
import { useMesas, useZonas } from "@/modules/mesas/hooks";

export function Mesero() {
  const zonas = useZonas();
  const mesas = useMesas();

  if (zonas.isLoading || mesas.isLoading) {
    return (
      <main className="p-8">
        <p>Cargando salón…</p>
      </main>
    );
  }

  if (zonas.isError || mesas.isError) {
    return (
      <main className="p-8">
        <p role="alert" className="text-rose-600">
          No se pudo cargar el salón.
        </p>
      </main>
    );
  }

  const zonasData = zonas.data ?? [];
  const mesasData = mesas.data ?? [];

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Mesero</h1>
      {zonasData.length === 0 ? (
        <p className="text-slate-500">No hay zonas configuradas.</p>
      ) : (
        zonasData.map((zona) => (
          <ZonaLayout
            key={zona.id}
            zona={zona}
            mesas={mesasData.filter((mesa) => mesa.zona_id === zona.id)}
          />
        ))
      )}
    </main>
  );
}
