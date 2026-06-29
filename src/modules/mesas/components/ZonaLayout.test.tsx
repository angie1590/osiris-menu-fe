import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fakeMesa, fakeZona } from "../testUtils";
import { ZonaLayout } from "./ZonaLayout";

describe("ZonaLayout", () => {
  it("renderiza la zona y sus mesas", () => {
    render(
      <ZonaLayout
        zona={fakeZona({ nombre: "Jardín" })}
        mesas={[fakeMesa({ numero_visible: "J1" }), fakeMesa({ numero_visible: "J2" })]}
      />,
    );
    expect(screen.getByText("Jardín")).toBeInTheDocument();
    expect(screen.getByText("J1")).toBeInTheDocument();
    expect(screen.getByText("J2")).toBeInTheDocument();
  });

  it("muestra estado vacío sin mesas", () => {
    render(<ZonaLayout zona={fakeZona()} mesas={[]} />);
    expect(screen.getByText(/Sin mesas/)).toBeInTheDocument();
  });
});
