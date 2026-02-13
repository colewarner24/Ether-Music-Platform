export class BasePage {
  constructor(page) {
    this.page = page;

    this.page.on("pageerror", (err) => {
      console.error("Page error:", err.message);
    });

    this.page.on("dialog", (dialog) => {
      console.log("Alert shown:", dialog.message());
      dialog.dismiss();
    });
  }
}
