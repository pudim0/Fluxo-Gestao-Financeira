import { test, expect } from "@playwright/test";

test("deve exibir o título", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Verifica se o título contém uma parte do texto esperado.
  await expect(page).toHaveTitle(/Playwright/);
});

test("deve abrir o link de início", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Clica no link de início.
  await page.getByRole("link", { name: "Get started" }).click();

  // Verifica se a página exibe o título Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});
