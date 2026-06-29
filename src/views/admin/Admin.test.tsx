import { fireEvent, screen } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeMesa, fakeZona, renderWithQuery } from "@/modules/mesas/testUtils";

vi.mock("@/modules/mesas/api");
import * as api from "@/modules/mesas/api";

import { Admin } from "./Admin";

describe("Vista Admin · unir/separar delega al backend", () => {
  beforeEach(() => vi.clearAllMocks());

  it("unir llama a la API y muestra el error del backend (la UI no decide la regla)", async () => {
    const zona = fakeZona({ nombre: "Barra" });
    const m1 = fakeMesa({ zona_id: zona.id, numero_visible: "M1" });
    const m2 = fakeMesa({ zona_id: zona.id, numero_visible: "M2" });
    (api.listarZonas as Mock).mockResolvedValue([zona]);
    (api.listarMesas as Mock).mockResolvedValue([m1, m2]);
    (api.crearGrupo as Mock).mockRejectedValue({
      code: "MESA_NO_AGRUPABLE",
      message: "Solo se pueden agrupar mesas Libres",
    });

    renderWithQuery(<Admin />);
    await screen.findByText("Barra");

    fireEvent.click(screen.getByLabelText("seleccionar M1"));
    fireEvent.click(screen.getByLabelText("seleccionar M2"));
    fireEvent.click(screen.getByRole("button", { name: /Unir seleccionadas/ }));

    expect(await screen.findByText("Solo se pueden agrupar mesas Libres")).toBeInTheDocument();
    expect(api.crearGrupo).toHaveBeenCalled();
    expect((api.crearGrupo as Mock).mock.calls[0][0]).toEqual([m1.id, m2.id]);
  });
});
