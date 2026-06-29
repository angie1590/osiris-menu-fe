import { z } from "zod";

// Validación de UX (Zod). El backend revalida y decide; el id de mesa lo genera el backend.

export const zonaFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  aforo_max: z.coerce.number().int("Debe ser entero").min(0, "No puede ser negativo").default(0),
});

export type ZonaFormValues = z.infer<typeof zonaFormSchema>;

export const mesaFormSchema = z.object({
  zona_id: z.string().uuid("Zona inválida"),
  numero_visible: z.string().min(1, "El número visible es obligatorio"),
  capacidad: z.coerce.number().int("Debe ser entero").min(0, "No puede ser negativo").default(0),
});

export type MesaFormValues = z.infer<typeof mesaFormSchema>;
