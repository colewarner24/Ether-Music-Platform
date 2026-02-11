// lib/media.js
export const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ??
  console.warn("NEXT_PUBLIC_MEDIA_BASE_URL not set in env");

export function artworkUrl(imageKey) {
  if (!imageKey) return null;
  return `https://${MEDIA_BASE}/${imageKey}`;
}

export function audioUrl(audioKey) {
  if (!audioKey) return console.warn("No audioKey provided for audioUrl");

  return `${MEDIA_BASE}/${audioKey}`;
}
