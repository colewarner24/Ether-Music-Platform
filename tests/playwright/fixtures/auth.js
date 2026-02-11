import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.Login("19cowarner@gmail.com", "pass", "coledozer");
    await use(page);
  },
});

export { expect };
