import { apiClient } from "@/api/apiClient";

// Endpoints del módulo §22 — pendientes de la propuesta funcional. Placeholder.
export const COCINA_BARRA_BASE = "/api/v1/cocina-barra";

export async function fetchCocinaBarraModuleInfo(): Promise<unknown> {
  const { data } = await apiClient.get(COCINA_BARRA_BASE);
  return data;
}
