import { useState } from "react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { DataState, ErrorState, LoadingState, PageHeader } from "@/components/states";
import type { ApiError } from "@/types/api";

import { MesaForm } from "@/modules/mesas/components/MesaForm";
import { MesaEstadoBadge } from "@/modules/mesas/components/MesaEstadoBadge";
import { MesaQrDialog } from "@/modules/mesas/components/MesaQrDialog";
import { ZonaEstadoBadge } from "@/modules/mesas/components/ZonaEstadoBadge";
import { ZonaForm } from "@/modules/mesas/components/ZonaForm";
import {
  useActivarZona,
  useCrearGrupo,
  useCrearMesa,
  useCrearZona,
  useDesactivarMesa,
  useDesactivarZona,
  useDisolverGrupo,
  useMarcarLibre,
  useMesas,
  useReactivarMesa,
  useZonas,
} from "@/modules/mesas/hooks";
import type { Mesa, Zona } from "@/modules/mesas/types";
import { esAgrupable, esDesactivable } from "@/modules/mesas/util";

const notifyError = (error: unknown) =>
  toast.error((error as ApiError)?.message ?? "Ocurrió un error");

export function Admin() {
  const zonas = useZonas();
  const mesas = useMesas();
  const crearZona = useCrearZona();
  const crearMesa = useCrearMesa();
  const activarZona = useActivarZona();
  const desactivarZona = useDesactivarZona();
  const marcarLibre = useMarcarLibre();
  const desactivarMesa = useDesactivarMesa();
  const reactivarMesa = useReactivarMesa();
  const crearGrupo = useCrearGrupo();
  const disolverGrupo = useDisolverGrupo();

  const [seleccion, setSeleccion] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSeleccion((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const unir = () =>
    crearGrupo.mutate(seleccion, { onError: notifyError, onSuccess: () => setSeleccion([]) });

  if (zonas.isLoading || mesas.isLoading) {
    return (
      <main className="mx-auto max-w-5xl p-8">
        <PageHeader title="Admin · Mesas y zonas" />
        <LoadingState />
      </main>
    );
  }
  if (zonas.isError || mesas.isError) {
    return (
      <main className="mx-auto max-w-5xl p-8">
        <PageHeader title="Admin · Mesas y zonas" />
        <ErrorState message="No se pudo cargar la administración." />
      </main>
    );
  }

  const zonasData = zonas.data ?? [];
  const mesasData = mesas.data ?? [];

  return (
    <main className="mx-auto max-w-5xl p-8">
      <PageHeader
        title="Admin · Mesas y zonas"
        description="Gestiona zonas y mesas. El backend valida y decide; la UI previene errores obvios."
      />

      <div className="mb-6 grid gap-6 md:grid-cols-[20rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Nueva zona</CardTitle>
          </CardHeader>
          <CardContent>
            <ZonaForm
              submitting={crearZona.isPending}
              onSubmit={(values) =>
                crearZona.mutate(
                  {
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    aforo_max: values.aforo_max,
                  },
                  { onError: notifyError },
                )
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unir mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <Button type="button" disabled={seleccion.length < 2} onClick={unir}>
              Unir mesas ({seleccion.length})
            </Button>
            <p className="mt-2 text-xs text-slate-500">
              Selecciona al menos 2 mesas libres para unirlas.
            </p>
          </CardContent>
        </Card>
      </div>

      <DataState isEmpty={zonasData.length === 0} emptyMessage="No hay zonas. Crea la primera arriba.">
        <div className="flex flex-col gap-6">
          {zonasData.map((zona) => (
            <ZonaAdminCard
              key={zona.id}
              zona={zona}
              mesas={mesasData.filter((m) => m.zona_id === zona.id)}
              seleccion={seleccion}
              onToggle={toggle}
              onActivarZona={() => activarZona.mutate(zona.id, { onError: notifyError })}
              onDesactivarZona={() => desactivarZona.mutate(zona.id, { onError: notifyError })}
              onMarcarLibre={(id) => marcarLibre.mutate(id, { onError: notifyError })}
              onDesactivarMesa={(id) => desactivarMesa.mutate(id, { onError: notifyError })}
              onReactivarMesa={(id) => reactivarMesa.mutate(id, { onError: notifyError })}
              onSepararGrupo={(gid) => disolverGrupo.mutate(gid, { onError: notifyError })}
              onCrearMesa={(values) =>
                crearMesa.mutate(
                  {
                    zona_id: zona.id,
                    numero_visible: values.numero_visible,
                    capacidad: values.capacidad,
                  },
                  { onError: notifyError },
                )
              }
              crearMesaPending={crearMesa.isPending}
            />
          ))}
        </div>
      </DataState>
    </main>
  );
}

interface ZonaAdminCardProps {
  zona: Zona;
  mesas: Mesa[];
  seleccion: string[];
  onToggle: (id: string) => void;
  onActivarZona: () => void;
  onDesactivarZona: () => void;
  onMarcarLibre: (id: string) => void;
  onDesactivarMesa: (id: string) => void;
  onReactivarMesa: (id: string) => void;
  onSepararGrupo: (grupoId: string) => void;
  onCrearMesa: (values: { numero_visible: string; capacidad: number }) => void;
  crearMesaPending: boolean;
}

function ZonaAdminCard({
  zona,
  mesas,
  seleccion,
  onToggle,
  onActivarZona,
  onDesactivarZona,
  onMarcarLibre,
  onDesactivarMesa,
  onReactivarMesa,
  onSepararGrupo,
  onCrearMesa,
  crearMesaPending,
}: ZonaAdminCardProps) {
  const zonaActiva = zona.estado === "activa";

  const columns: DataTableColumn<Mesa>[] = [
    {
      id: "sel",
      header: "",
      cell: (mesa) => (
        <input
          type="checkbox"
          aria-label={`seleccionar ${mesa.numero_visible}`}
          disabled={!esAgrupable(mesa)}
          checked={seleccion.includes(mesa.id)}
          onChange={() => onToggle(mesa.id)}
        />
      ),
    },
    {
      id: "numero",
      header: "Mesa",
      cell: (mesa) => <span className="font-medium">{mesa.numero_visible}</span>,
    },
    { id: "estado", header: "Estado", cell: (mesa) => <MesaEstadoBadge estado={mesa.estado} /> },
    { id: "cap", header: "Cap.", align: "right", cell: (mesa) => mesa.capacidad },
    {
      id: "acciones",
      header: "Acciones",
      align: "right",
      cell: (mesa) => (
        <div className="flex flex-wrap justify-end gap-2">
          <MesaQrDialog mesa={mesa} />
          {mesa.estado === "por_limpiar" && mesa.activa ? (
            <Button type="button" variant="outline" onClick={() => onMarcarLibre(mesa.id)}>
              Marcar libre
            </Button>
          ) : null}
          {mesa.grupo_id ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => onSepararGrupo(mesa.grupo_id as string)}
            >
              Separar grupo
            </Button>
          ) : null}
          {!mesa.activa && zonaActiva ? (
            <Button type="button" variant="outline" onClick={() => onReactivarMesa(mesa.id)}>
              Activar
            </Button>
          ) : null}
          {mesa.activa ? (
            <Button
              type="button"
              variant="outline"
              disabled={!esDesactivable(mesa)}
              title={
                esDesactivable(mesa)
                  ? undefined
                  : "No se puede desactivar: ocupada, reservada, agrupada o con comanda"
              }
              onClick={() => onDesactivarMesa(mesa.id)}
            >
              Desactivar mesa
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{zona.nombre}</CardTitle>
          <ZonaEstadoBadge estado={zona.estado} />
          <div className="ml-auto flex gap-2">
            {/* Acción contextual de zona (REG-20-21): nunca "Desactivar" en zona inactiva. */}
            {zonaActiva ? (
              <Button type="button" variant="outline" onClick={onDesactivarZona}>
                Desactivar zona
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onActivarZona}>
                Activar zona
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          rows={mesas}
          getRowId={(mesa) => mesa.id}
          emptyMessage="Sin mesas en esta zona."
          caption={`Mesas de ${zona.nombre}`}
        />

        {/* Nueva mesa solo en zona activa (REG-20-16/21). */}
        <div className="mt-4">
          {zonaActiva ? (
            <div className="max-w-sm">
              <p className="mb-2 text-sm font-medium">Nueva mesa</p>
              <MesaForm zonaId={zona.id} submitting={crearMesaPending} onSubmit={onCrearMesa} />
            </div>
          ) : (
            <Alert variant="info">Activa la zona para crear mesas.</Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
