import { get } from "node:http";

export class ProfilePage {
  constructor(page, username) {
    this.page = page;
    this.username = username;
  }

  async goto() {
    await this.page.goto(`/user/${this.username}`);
  }

  async isProfileVisible() {
    await this.page
      .getByRole("heading", { name: `${this.username}'s Profile` })
      .waitFor();
    return true;
  }

  async hasAuthToken() {
    console.log(await this.page.evaluate(() => Object.keys(localStorage)));
    return await this.page.evaluate(() => {
      return Boolean(localStorage.getItem("token"));
    });
  }
}
