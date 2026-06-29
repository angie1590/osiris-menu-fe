/**
 * Niveles de autorización 1–4 (placeholder, D-j).
 *
 * La UI no decide permisos finales: el backend es la autoridad. Aquí sólo se fija el
 * contrato de niveles para usarlo en la capa de presentación.
 */
export enum NivelAutorizacion {
  Nivel1 = 1, // Cualquier operador autenticado
  Nivel2 = 2, // Cajero, Admin Socio, Admin Contable, Super Admin
  Nivel3 = 3, // Admin Socio, Admin Contable, Super Admin
  Nivel4 = 4, // Admin Socio o Super Admin
}
