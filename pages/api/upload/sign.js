import prisma from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { decodeToken } from "./../utils";

// ========================
// SIGN UPLOAD URLS )
// ========================

export default async function handler(req, res) {
  console.log("Sign upload URL request received");
  if (req.method !== "POST") return res.status(405).end();

  let userId;
  try {
    userId = decodeToken(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const { audioType, artworkType, title, visibility, size } = req.body;

  if (!audioType) {
    return res.status(400).json({ error: "Missing audioType" });
  }

  const timestamp = Date.now();

  const audioKey = `audio/${userId}/${timestamp}.wav`;
  const artworkKey = artworkType ? `artwork/${userId}/${timestamp}.jpg` : null;

  const audioCommand = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    Key: audioKey,
    ContentType: audioType,
  });

  const audioUploadUrl = await getSignedUrl(r2, audioCommand, {
    expiresIn: 60,
  });

  let artworkUploadUrl = null;

  if (artworkKey) {
    const artworkCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: artworkKey,
      ContentType: artworkType,
    });

    artworkUploadUrl = await getSignedUrl(r2, artworkCommand, {
      expiresIn: 60,
    });
  }

  const audioUrl = `https://${process.env.CLOUDFLARE_R2_BUCKET}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${audioKey}`;
  const artworkUrl = artworkKey
    ? `https://${process.env.CLOUDFLARE_R2_BUCKET}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${artworkKey}`
    : null;

  const track = await prisma.track.create({
    data: {
      filename: audioUrl,
      title: title || "Untitled",
      audioKey,
      imageUrl: artworkUrl,
      size: size,
      private: visibility === "private",
      userId,
      mimetype: audioType,
    },
  });

  res.status(200).json({
    track,
    audioUploadUrl,
    artworkUploadUrl,
  });
}
