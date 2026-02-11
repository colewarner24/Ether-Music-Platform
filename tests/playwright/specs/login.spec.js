import { test, expect } from "../fixtures/auth";
import { ProfilePage } from "../pages/ProfilePage.js";

test("Verify loggin in functionality", async ({ page }) => {
  const profilePage = new ProfilePage(page, "coledozer");
  await profilePage.goto();

  expect(await profilePage.isProfileVisible()).toBe(true);
});

// test("Verify logged in profile page", async ({ loggedInPage }) => {
//   const profilePage = new ProfilePage(loggedInPage, "coledozer");
//   await profilePage.goto();

//   expect(await profilePage.isProfileVisible()).toBe(true);
//   expect(await profilePage.hasAuthToken()).toBe(true);
// });

// test("Verify loggin in functionality", async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   await loginPage.goto();
//   const profilePage = await loginPage.Login(
//     "19cowarner@gmail.com",
//     "pass",
//     "coledozer",
//   );
//   expect(await profilePage.isProfileVisible()).toBe(true);
//   expect(await profilePage.hasAuthToken()).toBe(true);
// });
