import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { handleMesaEvent } from "./realtime";
import { type MesaWebSocketEvent, isMesaWebSocketEvent } from "./ws";

describe("contrato WS de mesas", () => {
  it("reconoce mesa.desactivada y mesa.reactivada como eventos válidos", () => {
    expect(isMesaWebSocketEvent({ type: "mesa.desactivada", mesa_id: "m1", activa: false })).toBe(
      true,
    );
    expect(isMesaWebSocketEvent({ type: "mesa.reactivada", mesa_id: "m1", activa: true })).toBe(
      true,
    );
  });

  it("sigue reconociendo los eventos existentes", () => {
    expect(isMesaWebSocketEvent({ type: "mesa.estado_cambiado" })).toBe(true);
    expect(isMesaWebSocketEvent({ type: "zona.estado_cambiado" })).toBe(true);
    expect(isMesaWebSocketEvent({ type: "grupo.disuelto" })).toBe(true);
  });

  it("no reconoce eventos desconocidos ni datos inválidos", () => {
    expect(isMesaWebSocketEvent({ type: "otro.evento" })).toBe(false);
    expect(isMesaWebSocketEvent(null)).toBe(false);
    expect(isMesaWebSocketEvent("texto")).toBe(false);
    expect(isMesaWebSocketEvent({})).toBe(false);
  });
});

describe("handleMesaEvent", () => {
  function setup() {
    const qc = new QueryClient();
    const spy = vi.spyOn(qc, "invalidateQueries").mockResolvedValue();
    return { qc, spy };
  }

  it("mesa.desactivada invalida las queries de mesas/zonas", () => {
    const { qc, spy } = setup();
    const event: MesaWebSocketEvent = { type: "mesa.desactivada", mesa_id: "m1", activa: false };
    handleMesaEvent(qc, event);
    expect(spy).toHaveBeenCalledWith({ queryKey: ["mesas"] });
  });

  it("mesa.reactivada invalida las queries de mesas/zonas", () => {
    const { qc, spy } = setup();
    const event: MesaWebSocketEvent = { type: "mesa.reactivada", mesa_id: "m1", activa: true };
    handleMesaEvent(qc, event);
    expect(spy).toHaveBeenCalledWith({ queryKey: ["mesas"] });
  });

  it("los eventos existentes siguen invalidando", () => {
    const { qc, spy } = setup();
    handleMesaEvent(qc, {
      type: "mesa.estado_cambiado",
      mesa_id: "m1",
      estado_anterior: "libre",
      estado_nuevo: "ocupada",
    });
    handleMesaEvent(qc, {
      type: "grupo.disuelto",
      grupo_id: "g1",
      mesas_ids: ["m1", "m2"],
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
