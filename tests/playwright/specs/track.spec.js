import { assert } from "node:console";
import { test, expect } from "../fixtures/auth";
import { UploadPage } from "../pages/UploadPage.js";
import { ProfilePage } from "../pages/ProfilePage.js";
import { TrackPage } from "../pages/TrackPage.js";

const TRACK_NAME = "E2E Test Track " + Date.now();
const AUDIO_PATH = "tests/media/Like A G6.mp3";
const IMAGE_PATH =
  "tests/media/tumblr_5e09ac21d00f915b6c29aabaeb0212df_d29f698d_1280.jpg";

test("verify upload functionality with audio", async ({ page }) => {
  const uploadPage = new UploadPage(page);

  await uploadPage.goto();
  await uploadPage.uploadTrack(TRACK_NAME, AUDIO_PATH);

  const profilePage = new ProfilePage(page, process.env.TEST_USERNAME);
  await profilePage.goto();
  assert(await profilePage.isProfileVisible());
  assert(await profilePage.hasTrack(TRACK_NAME));

  await profilePage.deleteTrack(TRACK_NAME);
  assert(!(await profilePage.hasTrack(TRACK_NAME)));
});

test("verify upload functionality with audio and image", async ({ page }) => {
  const uploadPage = new UploadPage(page);

  await uploadPage.goto();
  await uploadPage.uploadTrack(TRACK_NAME, AUDIO_PATH, IMAGE_PATH);
  const profilePage = new ProfilePage(page, process.env.TEST_USERNAME);
  await profilePage.goto();
  assert(await profilePage.isProfileVisible());
  assert(await profilePage.hasTrack(TRACK_NAME));

  await profilePage.deleteTrack(TRACK_NAME);
  assert(!(await profilePage.hasTrack(TRACK_NAME)));
});
