import { test as setup, expect, request } from "@playwright/test";
import path from "path";
import { LoginPage } from "./pages/LoginPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import "dotenv/config";
import fs from "fs";

const authFile = path.join(__dirname, "./.auth/user.json");

setup("authenticate", async ({ page, browser }) => {
  const baseURL = process.env.BASE_URL || "http://localhost:3000";

  if (
    !process.env.TEST_EMAIL ||
    !process.env.TEST_PASSWORD ||
    !process.env.TEST_USERNAME
  ) {
    throw new Error(
      "Environment variables TEST_EMAIL, TEST_PASSWORD, and TEST_USERNAME are not set",
    );
  }

  if (fs.existsSync(authFile)) {
    const context = await browser.newContext({ storageState: authFile });
    const requestContext = context.request;

    try {
      const res = await requestContext.get(`${baseURL}/api/me`);

      if (res.ok()) {
        console.log("Auth state valid, skipping login");
        await context.close();
        return;
      } else {
        console.log(" Stored auth invalid, re-authenticating...");
      }
    } catch (err) {
      console.log("Auth validation failed, re-authenticating...");
    }

    await context.close();
  }

  // 🔐 Perform login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.Login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);

  await page.waitForTimeout(3000);
  console.log("Current URL after login:", page.url());
  console.log("Page title:", await page.title());

  await page.waitForURL("/user/" + process.env.TEST_USERNAME);
  await new ProfilePage(page, process.env.TEST_USERNAME).isProfileVisible();

  // 💾 Save fresh auth state
  await page.context().storageState({ path: authFile });
});
