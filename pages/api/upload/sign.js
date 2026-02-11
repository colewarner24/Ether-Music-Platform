import prisma from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { decodeToken } from "./../utils";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let userId;
  try {
    userId = decodeToken(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const { audioType, artworkType, title, visibility, size } = req.body;

  if (!audioType) return res.status(400).json({ error: "Missing audioType" });

  const timestamp = Date.now();
  const audioKey = `audio/${userId}/${timestamp}.wav`;
  const artworkKey = artworkType ? `artwork/${userId}/${timestamp}.jpg` : null;

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_AUDIO_BUCKET,
    Key: audioKey,
  });

  const audioUploadUrl = await getSignedUrl(r2, command, {
    expiresIn: 60,
  });

  let artworkUploadUrl = null;
  if (artworkKey) {
    const artworkCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_IMAGES_BUCKET,
      Key: artworkKey,
    });
    artworkUploadUrl = await getSignedUrl(r2, artworkCommand, {
      expiresIn: 60,
    });
  }

  const track = await prisma.track.create({
    data: {
      audioKey,
      imageKey: artworkKey,
      title: title || "Untitled",
      size,
      private: visibility === "private",
      mimetype: audioType,
      user: {
        connect: { id: userId },
      },
    },
  });

  res.status(200).json({
    track,
    audioUploadUrl: audioUploadUrl,
    artworkUploadUrl: artworkUploadUrl,
  });
}
