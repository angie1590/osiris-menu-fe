import { expect, test } from "@playwright/test";

// Smoke e2e mínimo de scaffolding. Requiere `npm run dev` (servidor en 5173).
test("la vista de admin carga", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
});
