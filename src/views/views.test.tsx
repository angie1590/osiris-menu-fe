import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { routes } from "@/routes";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </MemoryRouter>,
  );
}

describe("vistas placeholder enrutadas", () => {
  it.each([
    ["/mesero", "Mesero"],
    ["/cocina", "Cocina"],
    ["/barra", "Barra"],
    ["/caja", "Caja"],
    ["/admin", "Admin"],
  ])("renderiza %s", (path, heading) => {
    renderAt(path);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("renderiza la carta pública QR con el id de mesa", () => {
    renderAt("/qr/mesa-007");
    expect(screen.getByRole("heading", { name: "Carta pública QR" })).toBeInTheDocument();
    expect(screen.getByText(/mesa-007/)).toBeInTheDocument();
  });
});
