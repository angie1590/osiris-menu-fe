import { defineConfig, devices } from "@playwright/test";

// Scaffolding: smoke e2e mínimo. Asume `npm run dev` sirviendo en 5173.
export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
