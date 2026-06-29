import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ApiError } from "@/types/api";

import { MesaForm } from "@/modules/mesas/components/MesaForm";
import { MesaEstadoBadge } from "@/modules/mesas/components/MesaEstadoBadge";
import { ZonaEstadoBadge } from "@/modules/mesas/components/ZonaEstadoBadge";
import { ZonaForm } from "@/modules/mesas/components/ZonaForm";
import {
  useCrearGrupo,
  useCrearMesa,
  useCrearZona,
  useDesactivarZona,
  useDisolverGrupo,
  useMarcarLibre,
  useMesas,
  useZonas,
} from "@/modules/mesas/hooks";

export function Admin() {
  const zonas = useZonas();
  const mesas = useMesas();
  const crearZona = useCrearZona();
  const crearMesa = useCrearMesa();
  const marcarLibre = useMarcarLibre();
  const desactivarZona = useDesactivarZona();
  const crearGrupo = useCrearGrupo();
  const disolverGrupo = useDisolverGrupo();

  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  // La UI no decide reglas: llama a la API y muestra el error del backend (D-mz-5).
  const onError = (error: unknown) => setActionError((error as ApiError)?.message ?? "Error");

  const toggle = (id: string) =>
    setSeleccion((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const unir = () => {
    setActionError(null);
    crearGrupo.mutate(seleccion, { onError, onSuccess: () => setSeleccion([]) });
  };

  const separar = (grupoId: string) => {
    setActionError(null);
    disolverGrupo.mutate(grupoId, { onError });
  };

  if (zonas.isLoading || mesas.isLoading) {
    return (
      <main className="p-8">
        <p>Cargando…</p>
      </main>
    );
  }
  if (zonas.isError || mesas.isError) {
    return (
      <main className="p-8">
        <p role="alert" className="text-rose-600">
          No se pudo cargar la administración.
        </p>
      </main>
    );
  }

  const zonasData = zonas.data ?? [];
  const mesasData = mesas.data ?? [];

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Admin · Mesas y zonas</h1>

      {actionError ? (
        <p role="alert" className="mb-4 rounded bg-rose-50 px-3 py-2 text-rose-700">
          {actionError}
        </p>
      ) : null}

      <section className="mb-6 max-w-sm">
        <h2 className="mb-2 font-semibold">Nueva zona</h2>
        <ZonaForm
          submitting={crearZona.isPending}
          onSubmit={(values) =>
            crearZona.mutate(
              { nombre: values.nombre, descripcion: values.descripcion, aforo_max: values.aforo_max },
              { onError },
            )
          }
        />
      </section>

      <div className="mb-4 flex items-center gap-2">
        <Button type="button" disabled={seleccion.length < 2} onClick={unir}>
          Unir seleccionadas ({seleccion.length})
        </Button>
        <span className="text-xs text-slate-500">Selecciona 2+ mesas Libres para unirlas.</span>
      </div>

      {zonasData.length === 0 ? (
        <p className="text-slate-500">No hay zonas. Crea la primera arriba.</p>
      ) : (
        zonasData.map((zona) => {
          const mesasZona = mesasData.filter((m) => m.zona_id === zona.id);
          return (
            <section key={zona.id} className="mb-8 rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-lg font-bold">{zona.nombre}</h2>
                <ZonaEstadoBadge estado={zona.estado} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => desactivarZona.mutate(zona.id, { onError })}
                >
                  Desactivar
                </Button>
              </div>

              <ul className="mb-3 flex flex-col gap-2">
                {mesasZona.map((mesa) => (
                  <li key={mesa.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      aria-label={`seleccionar ${mesa.numero_visible}`}
                      checked={seleccion.includes(mesa.id)}
                      onChange={() => toggle(mesa.id)}
                    />
                    <span className="font-medium">{mesa.numero_visible}</span>
                    <MesaEstadoBadge estado={mesa.estado} />
                    {mesa.estado === "por_limpiar" ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => marcarLibre.mutate(mesa.id, { onError })}
                      >
                        Marcar libre
                      </Button>
                    ) : null}
                    {mesa.grupo_id ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => separar(mesa.grupo_id as string)}
                      >
                        Separar
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>

              <details>
                <summary className="cursor-pointer text-sm text-slate-600">Nueva mesa</summary>
                <div className="mt-2 max-w-sm">
                  <MesaForm
                    zonaId={zona.id}
                    submitting={crearMesa.isPending}
                    onSubmit={(values) =>
                      crearMesa.mutate(
                        {
                          zona_id: zona.id,
                          numero_visible: values.numero_visible,
                          capacidad: values.capacidad,
                        },
                        { onError },
                      )
                    }
                  />
                </div>
              </details>
            </section>
          );
        })
      )}
    </main>
  );
}
