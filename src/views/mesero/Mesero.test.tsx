import { screen } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { fakeMesa, fakeZona, renderWithQuery } from "@/modules/mesas/testUtils";

vi.mock("@/modules/mesas/api");
import * as api from "@/modules/mesas/api";

import { Mesero } from "./Mesero";

describe("Vista Mesero", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra el LoadingState compartido y luego el salón", async () => {
    (api.listarZonas as Mock).mockResolvedValue([fakeZona({ nombre: "Barra" })]);
    (api.listarMesas as Mock).mockResolvedValue([fakeMesa()]);

    renderWithQuery(<Mesero />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    expect(await screen.findByText("Barra")).toBeInTheDocument();
  });

  it("muestra el EmptyState compartido sin zonas", async () => {
    (api.listarZonas as Mock).mockResolvedValue([]);
    (api.listarMesas as Mock).mockResolvedValue([]);

    renderWithQuery(<Mesero />);
    expect(await screen.findByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText(/No hay zonas/)).toBeInTheDocument();
  });

  it("muestra el ErrorState compartido", async () => {
    (api.listarZonas as Mock).mockRejectedValue({ code: "X", message: "boom" });
    (api.listarMesas as Mock).mockResolvedValue([]);

    renderWithQuery(<Mesero />);
    expect(await screen.findByTestId("error-state")).toBeInTheDocument();
  });
});
