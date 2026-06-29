import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import type { Mesa, Zona } from "./types";

export function makeQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

export function withQueryClient(ui: ReactNode, client = makeQueryClient()): ReactElement {
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

export function renderWithQuery(ui: ReactNode, client = makeQueryClient()) {
  return render(withQueryClient(ui, client));
}

let seq = 0;
function nextId(): string {
  seq += 1;
  return `00000000-0000-4000-8000-${seq.toString().padStart(12, "0")}`;
}

export function fakeZona(overrides: Partial<Zona> = {}): Zona {
  return {
    id: nextId(),
    nombre: "Zona",
    descripcion: null,
    estado: "activa",
    aforo_max: 10,
    orden_visualizacion: 0,
    created_at: "2026-06-29T00:00:00Z",
    updated_at: "2026-06-29T00:00:00Z",
    ...overrides,
  };
}

export function fakeMesa(overrides: Partial<Mesa> = {}): Mesa {
  return {
    id: nextId(),
    zona_id: "00000000-0000-4000-8000-000000000001",
    numero_visible: "M1",
    capacidad: 4,
    estado: "libre",
    comanda_activa_id: null,
    reserva_activa_id: null,
    grupo_id: null,
    activa: true,
    created_at: "2026-06-29T00:00:00Z",
    updated_at: "2026-06-29T00:00:00Z",
    ...overrides,
  };
}
