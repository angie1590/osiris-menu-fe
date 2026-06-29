import type { Mesa } from "./types";

/**
 * Prevención UX (REG-20-20): una mesa es seleccionable para unir solo si está `libre`,
 * activa y sin grupo. NO es la regla de negocio (el backend es la autoridad); solo evita
 * errores obvios en la UI.
 */
export function esAgrupable(mesa: Mesa): boolean {
  return mesa.activa && mesa.estado === "libre" && mesa.grupo_id == null;
}

/**
 * Prevención UX (REG-20-18/21): una mesa activa es desactivable solo si no está
 * ocupada/reservada, no está agrupada ni tiene comanda activa. El backend revalida.
 */
export function esDesactivable(mesa: Mesa): boolean {
  return (
    mesa.activa &&
    mesa.estado !== "ocupada" &&
    mesa.estado !== "reservada" &&
    mesa.grupo_id == null &&
    mesa.comanda_activa_id == null
  );
}
