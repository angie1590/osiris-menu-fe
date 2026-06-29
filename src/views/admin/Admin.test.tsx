import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeMesa, fakeZona, renderWithQuery } from "@/modules/mesas/testUtils";

vi.mock("@/modules/mesas/api");
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() }, Toaster: () => null }));

import * as api from "@/modules/mesas/api";
import { toast } from "sonner";

import { Admin } from "./Admin";

function setup(zonas: unknown[], mesas: unknown[]) {
  (api.listarZonas as Mock).mockResolvedValue(zonas);
  (api.listarMesas as Mock).mockResolvedValue(mesas);
  return renderWithQuery(<Admin />);
}

describe("Vista Admin (hardening §20)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("no permite seleccionar mesas no agrupables (REG-20-20)", async () => {
    const zona = fakeZona({ nombre: "Barra" });
    const libre = fakeMesa({ zona_id: zona.id, numero_visible: "L1", estado: "libre" });
    const ocupada = fakeMesa({ zona_id: zona.id, numero_visible: "O1", estado: "ocupada" });
    const porLimpiar = fakeMesa({ zona_id: zona.id, numero_visible: "P1", estado: "por_limpiar" });
    const reservada = fakeMesa({ zona_id: zona.id, numero_visible: "R1", estado: "reservada" });
    setup([zona], [libre, ocupada, porLimpiar, reservada]);
    await screen.findByText("Barra");

    expect((screen.getByLabelText("seleccionar L1") as HTMLInputElement).disabled).toBe(false);
    expect((screen.getByLabelText("seleccionar O1") as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByLabelText("seleccionar P1") as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByLabelText("seleccionar R1") as HTMLInputElement).disabled).toBe(true);
  });

  it("habilita 'Unir mesas' solo con 2+ mesas libres (REG-20-20)", async () => {
    const zona = fakeZona({ nombre: "Barra" });
    const m1 = fakeMesa({ zona_id: zona.id, numero_visible: "M1", estado: "libre" });
    const m2 = fakeMesa({ zona_id: zona.id, numero_visible: "M2", estado: "libre" });
    setup([zona], [m1, m2]);
    await screen.findByText("Barra");

    const boton = screen.getByRole("button", { name: /Unir mesas/ });
    expect(boton).toBeDisabled();
    fireEvent.click(screen.getByLabelText("seleccionar M1"));
    expect(boton).toBeDisabled();
    fireEvent.click(screen.getByLabelText("seleccionar M2"));
    expect(boton).toBeEnabled();
  });

  it("zona inactiva ofrece 'Activar zona' y no 'Desactivar zona' (REG-20-21)", async () => {
    const zona = fakeZona({ nombre: "Jardín", estado: "inactiva" });
    setup([zona], []);
    await screen.findByText("Jardín");
    expect(screen.getByRole("button", { name: "Activar zona" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Desactivar zona" })).toBeNull();
  });

  it("no muestra formulario 'Nueva mesa' en zona inactiva ni en_cierre", async () => {
    const inactiva = fakeZona({ nombre: "Zinact", estado: "inactiva" });
    const enCierre = fakeZona({ nombre: "Zcierre", estado: "en_cierre" });
    setup([inactiva, enCierre], []);
    await screen.findByText("Zinact");
    expect(screen.queryByText("Nueva mesa")).toBeNull();
    expect(screen.getAllByText("Activa la zona para crear mesas.")).toHaveLength(2);
  });

  it("mesa muestra QR; inactiva ofrece Activar; agrupada ofrece Separar grupo", async () => {
    const zona = fakeZona({ nombre: "Barra", estado: "activa" });
    const inactiva = fakeMesa({ zona_id: zona.id, numero_visible: "I1", estado: "inactiva", activa: false });
    const agrupada = fakeMesa({ zona_id: zona.id, numero_visible: "G1", estado: "libre", grupo_id: "grp-1" });
    setup([zona], [inactiva, agrupada]);
    await screen.findByText("Barra");

    // Usa el DataTable compartido (no listas con estilo propio por vista).
    expect(screen.getAllByRole("table").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: "Ver QR" }).length).toBeGreaterThanOrEqual(2);

    const filaInactiva = screen.getByText("I1").closest("tr") as HTMLElement;
    expect(within(filaInactiva).getByRole("button", { name: "Activar" })).toBeInTheDocument();

    const filaAgrupada = screen.getByText("G1").closest("tr") as HTMLElement;
    expect(within(filaAgrupada).getByRole("button", { name: "Separar grupo" })).toBeInTheDocument();
  });

  it("muestra el error del backend como toast (REG: errores consistentes)", async () => {
    const zona = fakeZona({ nombre: "Barra" });
    const m1 = fakeMesa({ zona_id: zona.id, numero_visible: "M1", estado: "libre" });
    const m2 = fakeMesa({ zona_id: zona.id, numero_visible: "M2", estado: "libre" });
    (api.crearGrupo as Mock).mockRejectedValue({ code: "X", message: "Operación inválida" });
    setup([zona], [m1, m2]);
    await screen.findByText("Barra");

    fireEvent.click(screen.getByLabelText("seleccionar M1"));
    fireEvent.click(screen.getByLabelText("seleccionar M2"));
    fireEvent.click(screen.getByRole("button", { name: /Unir mesas/ }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Operación inválida"));
  });
});
