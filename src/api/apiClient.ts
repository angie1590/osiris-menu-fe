import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import type { ApiError } from "@/types/api";

/** Métodos mutadores que requieren idempotencia por `X-Request-Id`. */
const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

/**
 * Inyecta un `X-Request-Id` (UUID v4) en toda mutación, para idempotencia (D-b/D-f).
 * Exportado para poder testearlo de forma aislada.
 */
export function attachRequestId(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const method = (config.method ?? "get").toLowerCase();
  if (MUTATING_METHODS.has(method)) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set("X-Request-Id", crypto.randomUUID());
  }
  return config;
}

// Todo HTTP pasa por src/api/. Sesión por cookie httpOnly (withCredentials).
// No se guardan tokens en localStorage/sessionStorage.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  withCredentials: true,
});

apiClient.interceptors.request.use(attachRequestId);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const envelope = error?.response?.data?.error as ApiError | undefined;
    if (envelope) {
      return Promise.reject(envelope);
    }
    return Promise.reject(error);
  },
);
