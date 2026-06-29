import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import type { EstadoMesa } from "../types";

const ZONAS_KEY = ["mesas", "zonas"] as const;
const MESAS_KEY = ["mesas", "mesas"] as const;

export function useZonas() {
  return useQuery({ queryKey: ZONAS_KEY, queryFn: api.listarZonas });
}

export function useMesas(params?: { zona_id?: string; estado?: EstadoMesa }) {
  return useQuery({ queryKey: [...MESAS_KEY, params], queryFn: () => api.listarMesas(params) });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ZONAS_KEY });
    void qc.invalidateQueries({ queryKey: MESAS_KEY });
  };
}

export function useCrearZona() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.crearZona, onSuccess: invalidate });
}

export function useCerrarZona() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => api.cerrarZona(id, motivo),
    onSuccess: invalidate,
  });
}

export function useActivarZona() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.activarZona, onSuccess: invalidate });
}

export function useDesactivarZona() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.desactivarZona, onSuccess: invalidate });
}

export function useCrearMesa() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.crearMesa, onSuccess: invalidate });
}

export function useMarcarLibre() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.marcarLibre, onSuccess: invalidate });
}

export function useCrearGrupo() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.crearGrupo, onSuccess: invalidate });
}

export function useDisolverGrupo() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: api.disolverGrupo, onSuccess: invalidate });
}
