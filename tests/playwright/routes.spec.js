import { test, expect } from "@playwright/test";

test("Home page render correctly", async ({ page }) => {
  await page.goto("http://localhost:3000/tracks");
  await expect(page.getByRole("link", { name: "the ether" })).toHaveText(
    /the ether/
  );
  await expect(page.getByRole("heading", { name: "Tracks" })).toBeVisible();
});
