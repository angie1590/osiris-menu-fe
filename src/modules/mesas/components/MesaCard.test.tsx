import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fakeMesa } from "../testUtils";
import { MesaCard } from "./MesaCard";

describe("MesaCard", () => {
  it("muestra la etiqueta canónica del estado (valor técnico → label)", () => {
    render(<MesaCard mesa={fakeMesa({ estado: "por_limpiar" })} />);
    expect(screen.getByText("Por limpiar")).toBeInTheDocument();
  });

  it("muestra el indicador de grupo cuando hay grupo_id", () => {
    render(<MesaCard mesa={fakeMesa({ grupo_id: "g1" })} />);
    expect(screen.getByTestId("grupo-indicator")).toBeInTheDocument();
  });

  it("no muestra indicador de grupo sin grupo_id", () => {
    render(<MesaCard mesa={fakeMesa({ grupo_id: null })} />);
    expect(screen.queryByTestId("grupo-indicator")).toBeNull();
  });
});
