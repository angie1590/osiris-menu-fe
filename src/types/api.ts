/** Envelope de error estructurado del backend: `{ error: { code, message, details? } }`. */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
