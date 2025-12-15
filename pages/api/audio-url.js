// pages/api/audio-url.js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET;

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 }); // 5 minutes
    res.status(200).json({ signedUrl });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
