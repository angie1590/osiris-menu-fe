import { describe, expect, it } from "vitest";

import { mesaFormSchema, zonaFormSchema } from "./formSchemas";

const UUID = "00000000-0000-4000-8000-000000000001";

describe("zonaFormSchema", () => {
  it("rechaza nombre vacío", () => {
    expect(zonaFormSchema.safeParse({ nombre: "" }).success).toBe(false);
  });

  it("acepta nombre válido", () => {
    expect(zonaFormSchema.safeParse({ nombre: "Barra", aforo_max: 5 }).success).toBe(true);
  });
});

describe("mesaFormSchema", () => {
  it("rechaza zona_id no-uuid", () => {
    expect(mesaFormSchema.safeParse({ zona_id: "x", numero_visible: "M1" }).success).toBe(false);
  });

  it("rechaza numero_visible vacío", () => {
    expect(mesaFormSchema.safeParse({ zona_id: UUID, numero_visible: "" }).success).toBe(false);
  });

  it("rechaza capacidad 0 (capacidad positiva, REG-20-17)", () => {
    expect(
      mesaFormSchema.safeParse({ zona_id: UUID, numero_visible: "M1", capacidad: 0 }).success,
    ).toBe(false);
  });

  it("acepta entrada válida", () => {
    const parsed = mesaFormSchema.safeParse({
      zona_id: UUID,
      numero_visible: "M1",
      capacidad: 4,
    });
    expect(parsed.success).toBe(true);
  });
});
