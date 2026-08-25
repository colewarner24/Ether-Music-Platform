const pagesWithDialogHandler = new WeakSet();

export class BasePage {
  constructor(page) {
    this.page = page;

    this.page.on("pageerror", (err) => {
      console.error("Page error:", err.message);
    });

    if (!pagesWithDialogHandler.has(page)) {
      pagesWithDialogHandler.add(page);
      this.page.on("dialog", async (dialog) => {
        console.log("Alert shown:", dialog.message());
        await dialog.dismiss();
      });
    }
  }
}
