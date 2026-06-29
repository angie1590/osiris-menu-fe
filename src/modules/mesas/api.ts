import { apiClient } from "@/api/apiClient";

// Endpoints del módulo §20 — pendientes de la propuesta funcional. Placeholder.
export const MESAS_BASE = "/api/v1/mesas";

export async function fetchMesasModuleInfo(): Promise<unknown> {
  const { data } = await apiClient.get(MESAS_BASE);
  return data;
}
