import { BasePage } from "./BasePage.js";
import { TrackPage } from "./TrackPage.js";

export class UploadPage extends BasePage {
  constructor(page) {
    super(page);
    this.audioInput = page.getByRole("button", { name: "Choose File" });
    this.imageInput = page.getByRole("button", { name: "Artwork (optional)" });
    this.visibilitySelect = page.getByLabel("VisibilityPublicPrivate");
    this.heading = page.getByRole("heading", { name: "Upload a Track" });
    this.uploadButton = page.getByRole("button", { name: "Upload" });
  }

  async goto() {
    await this.page.goto(`/upload`);
    if (!(await this.isOnUploadPage())) {
      throw new Error("Not Signed in - Cannot access upload page");
    }
  }

  async uploadTrack(title, filePath, imagePath = null, visibility = "public") {
    await this.page.getByRole("textbox", { name: "Track title" }).fill(title);

    await this.audioInput.setInputFiles(filePath);
    if (imagePath) {
      await this.imageInput.setInputFiles(imagePath);
    }
    if (visibility === "private") {
      await this.visibilitySelect.selectOption("Private");
    }
    await this.uploadButton.click();
    await this.page.waitForURL("/tracks", { timeout: 10000 });
    return new TrackPage(this.page);
  }

  async isOnUploadPage() {
    await this.heading.waitFor();
    return true;
  }
}
