import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataState } from "./states";

describe("DataState (estados compartidos)", () => {
  it("loading tiene prioridad y oculta children", () => {
    render(
      <DataState isLoading>
        <div>contenido</div>
      </DataState>,
    );
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    expect(screen.queryByText("contenido")).toBeNull();
  });

  it("muestra ErrorState ante error", () => {
    render(
      <DataState isError errorMessage="falló">
        <div>contenido</div>
      </DataState>,
    );
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
    expect(screen.getByText("falló")).toBeInTheDocument();
  });

  it("muestra EmptyState cuando está vacío", () => {
    render(
      <DataState isEmpty emptyMessage="sin datos">
        <div>contenido</div>
      </DataState>,
    );
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("sin datos")).toBeInTheDocument();
  });

  it("renderiza children cuando hay datos", () => {
    render(
      <DataState>
        <div>contenido</div>
      </DataState>,
    );
    expect(screen.getByText("contenido")).toBeInTheDocument();
  });
});
