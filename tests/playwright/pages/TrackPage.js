import { BaseTrackPage } from "./BaseTrackPage.js";
import { expect } from "@playwright/test";

export class TrackPage extends BaseTrackPage {
  constructor(page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/tracks", {
      waitUntil: "domcontentloaded",
    });
  }

  async isPageLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Tracks" }),
    ).toBeVisible({ timeout: 10000 });

    return true;
  }
}
