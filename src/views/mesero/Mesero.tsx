import { DataState, PageHeader } from "@/components/states";

import { ZonaLayout } from "@/modules/mesas/components/ZonaLayout";
import { useMesas, useZonas } from "@/modules/mesas/hooks";

export function Mesero() {
  const zonas = useZonas();
  const mesas = useMesas();

  const zonasData = zonas.data ?? [];
  const mesasData = mesas.data ?? [];

  return (
    <main className="mx-auto max-w-5xl p-8">
      <PageHeader title="Mesero" description="Salón por zonas. Toca una mesa para operarla." />
      <DataState
        isLoading={zonas.isLoading || mesas.isLoading}
        isError={zonas.isError || mesas.isError}
        isEmpty={zonasData.length === 0}
        loadingMessage="Cargando salón…"
        errorMessage="No se pudo cargar el salón."
        emptyMessage="No hay zonas configuradas."
      >
        {zonasData.map((zona) => (
          <ZonaLayout
            key={zona.id}
            zona={zona}
            mesas={mesasData.filter((mesa) => mesa.zona_id === zona.id)}
          />
        ))}
      </DataState>
    </main>
  );
}
