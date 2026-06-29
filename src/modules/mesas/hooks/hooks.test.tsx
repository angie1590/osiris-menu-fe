import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { type Mock, describe, expect, it, vi } from "vitest";

import { fakeZona, withQueryClient } from "../testUtils";

vi.mock("../api");
import * as api from "../api";
import { useZonas } from "./index";

describe("hooks de mesas", () => {
  it("useZonas llama al cliente API del módulo", async () => {
    (api.listarZonas as Mock).mockResolvedValue([fakeZona()]);

    const { result } = renderHook(() => useZonas(), {
      wrapper: ({ children }: { children: ReactNode }) => withQueryClient(children),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.listarZonas).toHaveBeenCalled();
    expect(result.current.data).toHaveLength(1);
  });
});
