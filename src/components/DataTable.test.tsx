import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataTable, type DataTableColumn } from "./DataTable";

interface Row {
  id: string;
  nombre: string;
}

const columns: DataTableColumn<Row>[] = [
  { id: "nombre", header: "Nombre", cell: (r) => r.nombre },
];

const rows: Row[] = [
  { id: "1", nombre: "Alfa" },
  { id: "2", nombre: "Beta" },
];

describe("DataTable (componente compartido)", () => {
  it("renderiza encabezados y filas en una tabla", () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Alfa")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("usa el LoadingState compartido", () => {
    render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} isLoading />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("usa el ErrorState compartido", () => {
    render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} isError />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("usa el EmptyState compartido sin filas", () => {
    render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} emptyMessage="Vacío" />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Vacío")).toBeInTheDocument();
  });
});
