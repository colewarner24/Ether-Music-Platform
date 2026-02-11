import { assert } from "node:console";
import { test, expect } from "../fixtures/auth";
import { UploadPage } from "../pages/UploadPage.js";

const TRACK_NAME = "E2E Test Track";
const AUDIO_PATH = "tests/media/Like A G6.mp3";
const IMAGE_PATH =
  "tests/media/tumblr_5e09ac21d00f915b6c29aabaeb0212df_d29f698d_1280.jpg";

test("verify upload functionality without image", async ({ page }) => {
  const uploadPage = new UploadPage(page);

  await uploadPage.goto();
  const trackPage = await uploadPage.uploadTrack(TRACK_NAME, AUDIO_PATH);
  assert(trackPage.isPageLoaded());
  assert(trackPage.isTrackVisible(TRACK_NAME));
});
