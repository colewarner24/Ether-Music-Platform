import prisma from "@/lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { decodeToken } from "./utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    let userId;
    let audioKey;
    try {
      userId = decodeToken(req);
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }

    const form = formidable({
      multiples: true,
      uploadDir: "./public/uploads",
      keepExtensions: true,
    });

    return form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Error parsing form" });

      let title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      let visibility = Array.isArray(fields.visibility)
        ? fields.visibility[0]
        : fields.visibility;

      const audio = files.file?.[0];
      const artwork = files.artwork?.[0];

      if (!audio)
        return res.status(400).json({ error: "No audio file uploaded" });

      let audioUrl;
      let artworkUrl;

      // ============================================================
      //  LOCAL FILESYSTEM MODE
      // ============================================================
      if (process.env.NODE_ENV === "development") {
        const audioFilename = path.basename(audio.filepath);
        const artworkFilename = artwork
          ? path.basename(artwork.filepath)
          : null;

        audioUrl = `/uploads/${audioFilename}`;
        artworkUrl = artworkFilename ? `${artworkFilename}` : null;
      }

      // ============================================================
      //  CLOUDLFARE R2 MODE (PRODUCTION)
      // ============================================================
      else if (process.env.NODE_ENV === "production") {
        console.log("Uploading to Cloudflare R2...");
        const audioBuffer = fs.readFileSync(audio.filepath);
        audioKey = `audio/${Date.now()}-${audio.originalFilename}`;

        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET,
            Key: audioKey,
            Body: audioBuffer,
            ContentType: audio.mimetype,
          })
        );

        audioUrl = `https://${process.env.CLOUDFLARE_R2_BUCKET}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${audioKey}`;

        if (artwork) {
          const imgBuffer = fs.readFileSync(artwork.filepath);
          const imgKey = `artwork/${Date.now()}-${artwork.originalFilename}`;

          await r2.send(
            new PutObjectCommand({
              Bucket: process.env.CLOUDFLARE_R2_BUCKET,
              Key: imgKey,
              Body: imgBuffer,
              ContentType: artwork.mimetype,
            })
          );

          artworkUrl = `https://${process.env.CLOUDFLARE_R2_BUCKET}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${imgKey}`;
        }
      }

      // ============================================================
      //  SAVE IN DATABASE (Same for both local and R2)
      // ============================================================
      const track = await prisma.track.create({
        data: {
          filename: audioUrl,
          title: title || audio.originalFilename || "Untitled",
          audioKey: audioKey || "",
          mimetype: audio.mimetype,
          size: audio.size || 0,
          imageUrl: artworkUrl,
          private: visibility === "private",
          userId: userId,
        },
      });

      return res.status(200).json(track);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .json({ error: "Upload failed", details: error.message });
  }
}
