import { apiClient } from "@/api/apiClient";

// Endpoints del módulo §21 — pendientes de la propuesta funcional. Placeholder.
export const COMANDAS_BASE = "/api/v1/comandas";

export async function fetchComandasModuleInfo(): Promise<unknown> {
  const { data } = await apiClient.get(COMANDAS_BASE);
  return data;
}
