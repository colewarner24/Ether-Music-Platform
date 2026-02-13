import { ProfilePage } from "./ProfilePage.js";
import { BasePage } from "./BasePage.js";

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async goto() {
    await this.page.goto("http://localhost:3000/login");
  }

  async Login(email, password, username) {
    await this.page.getByRole("textbox", { name: "Email" }).click();
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).click();
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Log In" }).click();
    return new ProfilePage(this.page, username);
  }
}
module.exports = { LoginPage };
