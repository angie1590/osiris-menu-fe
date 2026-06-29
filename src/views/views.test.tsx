import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Barra } from "@/views/barra/Barra";
import { Caja } from "@/views/caja/Caja";
import { Cocina } from "@/views/cocina/Cocina";
import { PublicoQR } from "@/views/publico/PublicoQR";

describe("vistas placeholder estáticas", () => {
  it.each([
    [<Cocina key="c" />, "Cocina"],
    [<Barra key="b" />, "Barra"],
    [<Caja key="j" />, "Caja"],
  ])("renderiza encabezado", (element, heading) => {
    render(<MemoryRouter>{element}</MemoryRouter>);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("renderiza la carta pública QR con el id de mesa", () => {
    render(
      <MemoryRouter initialEntries={["/qr/mesa-007"]}>
        <Routes>
          <Route path="/qr/:mesaId" element={<PublicoQR />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Carta pública QR" })).toBeInTheDocument();
    expect(screen.getByText(/mesa-007/)).toBeInTheDocument();
  });
});
