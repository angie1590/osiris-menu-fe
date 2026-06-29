import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";

import { apiClient, attachRequestId } from "@/api/apiClient";

function makeConfig(method: string): InternalAxiosRequestConfig {
  return { method, headers: new AxiosHeaders() } as InternalAxiosRequestConfig;
}

describe("apiClient", () => {
  it("se instancia con credenciales por cookie (sin tokens en storage)", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });

  it("inyecta X-Request-Id en mutaciones", () => {
    const config = attachRequestId(makeConfig("post"));
    const header = config.headers.get("X-Request-Id");
    expect(typeof header).toBe("string");
    expect(header).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it("no inyecta X-Request-Id en GET", () => {
    const config = attachRequestId(makeConfig("get"));
    expect(config.headers.get("X-Request-Id")).toBeFalsy();
  });
});
