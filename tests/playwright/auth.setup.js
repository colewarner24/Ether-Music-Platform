import { test as setup, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "./pages/LoginPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import "dotenv/config";
import fs from "fs";

const authFile = path.join(__dirname, "./.auth/user.json");

setup("authenticate", async ({ page }) => {
  //check if auth state file exists and has token
  if (fs.existsSync(authFile)) {
    const state = JSON.parse(fs.readFileSync(authFile, "utf-8"));

    const hasToken = state.origins?.some((origin) =>
      origin.localStorage?.some((item) => item.name === "token"),
    );

    if (hasToken) {
      console.log("✅ Auth state already exists, skipping login");
      return;
    }
  }

  // Perform authentication steps. Replace these actions with your own.)
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.Login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);

  await page.waitForURL("/user/" + process.env.TEST_USERNAME);
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await new ProfilePage(page, process.env.TEST_USERNAME).isProfileVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
