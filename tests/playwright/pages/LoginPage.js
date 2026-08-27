import { ProfilePage } from "./ProfilePage.js";
import { BasePage } from "./BasePage.js";

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/auth/login", { waitUntil: "domcontentloaded" });
  }

  async Login(email, password, username) {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: /Sign in/i }).click();
    return new ProfilePage(this.page, username);
  }
}
module.exports = { LoginPage };
