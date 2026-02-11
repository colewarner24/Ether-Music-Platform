import { TrackPage } from "./TrackPage.js";

export class UploadPage {
  constructor(page) {
    this.page = page;

    this.page.on("pageerror", (err) => {
      console.error("Page error:", err.message);
      //throw new Error(`Page error: ${err.message}`);
    });

    // this.page.on("console", (msg) => {
    //   if (msg.type() === "error") {
    //     console.log("Console error:", msg.text());
    //     throw new Error(`Console error: ${msg.text()}`);
    //   }
    // });

    this.page.on("dialog", (dialog) => {
      console.log("Alert shown:", dialog.message());
      dialog.dismiss();
    });
  }

  async goto() {
    await this.page.goto(`/upload`);
    if (!(await this.isOnUploadPage())) {
      throw new Error("Not Signed in - Cannot access upload page");
    }
  }

  async uploadTrack(title, filePath, imagePath = null, visibility = "public") {
    await this.page.getByRole("textbox", { name: "Track title" }).fill(title);
    await this.page
      .getByRole("button", { name: "Choose File" })
      .setInputFiles(filePath);
    // const upload = this.page.locator('div:has-text("Drag & drop audio")');
    // const fileInput = await upload.locator('input[type="file"]');
    // await fileInput.setInputFiles(filePath);
    if (imagePath) {
      await this.page;
      getByRole("button", { name: "Artwork (optional)" }).setInputFiles(
        imagePath,
      );
    }
    if (visibility === "private") {
      await this.page
        .getByLabel("VisibilityPublicPrivate")
        .selectOption("Private");
    }
    await this.page.getByRole("button", { name: "Upload" }).click();
    await this.page.waitForURL("/tracks", { timeout: 10000 });
    return new TrackPage(this.page);
  }

  async isOnUploadPage() {
    await this.page.getByRole("heading", { name: "Upload a Track" }).waitFor();
    return true;
  }
}
