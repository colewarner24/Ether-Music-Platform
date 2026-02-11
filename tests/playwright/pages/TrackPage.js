export class TrackPage {
  constructor(page) {
    this.page = page;
    this.tracks = page.locator(".sc-card");
  }

  async goto() {
    await this.page.goto(`/tracks`);
  }

  async isPageLoaded() {
    try {
      await this.page
        .getByRole("heading", { name: "Tracks" })
        .waitFor({ timeout: 5000 });
    } catch (e) {
      throw new Error(
        "Track page did not load properly. with error: " + e.message,
      );
    }
    return true;
  }

  async isTrackVisible(title) {
    try {
      await this.page
        .locator(".sc-card", { hasText: title })
        .nth(0)
        .waitFor({ timeout: 5000 });
    } catch (e) {
      throw new Error(
        `Track with title "${title}" not found on the page. with error: ${e.message}`,
      );
    }
    return true;
  }

  async deleteTrack(title) {
    await this.page.pause();
  }
}
