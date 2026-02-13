import { BaseTrackPage } from "./BaseTrackPage.js";
import { expect } from "@playwright/test";

export class ProfilePage extends BaseTrackPage {
  constructor(page, username) {
    super(page);
    this.username = username;
  }

  async goto() {
    await this.page.goto(`/user/${this.username}`, {
      waitUntil: "domcontentloaded",
    });
  }

  async isProfileVisible() {
    await expect(
      this.page.getByRole("heading", {
        name: `${this.username}'s Profile`,
      }),
    ).toBeVisible({ timeout: 10000 });

    return true;
  }

  async hasAuthToken() {
    return await this.page.evaluate(() =>
      Boolean(localStorage.getItem("token")),
    );
  }
}
