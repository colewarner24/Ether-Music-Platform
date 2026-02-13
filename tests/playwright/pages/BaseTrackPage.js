import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class BaseTrackPage extends BasePage {
  constructor(page) {
    super(page);
    this.tracks = page.locator(".sc-card");
  }

  getTrackLocator(title) {
    return this.tracks.filter({ hasText: title }).first();
  }

  async hasTrack(title) {
    const track = this.getTrackLocator(title);

    try {
      await expect(track).toBeVisible({ timeout: 10000 });
      return true;
    } catch {
      throw new Error(`Track with title "${title}" not found on the page.`);
    }
  }

  async deleteTrack(title) {
    const track = this.getTrackLocator(title);

    await expect(track).toBeVisible({ timeout: 10000 });

    await track.getByRole("button", { name: "Track actions" }).click();
    await track.getByRole("button", { name: "Delete Track" }).click();
  }
}
