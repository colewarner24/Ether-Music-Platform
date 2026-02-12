import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth) throw new Error("No token");

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId;
}

export default async function handler(req, res) {
  let { id } = req.query;
  id = parseInt(id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid track ID" });
  }

  let userId;
  try {
    userId = getUserId(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  // 🔒 Ensure track exists & user owns it
  const track = await prisma.track.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }

  if (track.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // ========================
  // EDIT TRACK
  // ========================
  if (req.method === "PATCH") {
    const { title, artist, imageKey, private: isPrivate } = req.body;

    const updated = await prisma.track.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(artist !== undefined && { artist }),
        ...(imageKey !== undefined && { imageKey }),
        ...(isPrivate !== undefined && { private: isPrivate }),
      },
    });

    return res.json(updated);
  }

  // ========================
  // DELETE TRACK
  // ========================
  if (req.method === "DELETE") {
    // fetch full track info first
    const fullTrack = await prisma.track.findUnique({
      where: { id },
      select: {
        title: true,
        audioKey: true,
        imageKey: true,
      },
    });

    // ========================
    // LOCAL FILE DELETION
    // ========================
    if (process.env.NEXT_PUBLIC_STORAGE_PROVIDER === "local") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      if (fullTrack?.filename) {
        await fs
          .unlink(path.join(uploadsDir, fullTrack.filename))
          .catch(() => {});
      }

      if (fullTrack?.imageKey) {
        await fs
          .unlink(path.join(uploadsDir, fullTrack.imageKey))
          .catch(() => {});
      }
    }

    // ========================
    // PROD (R2 / S3) DELETION
    // ========================
    else {
      const deletes = [];

      try {
        if (fullTrack.audioKey) {
          deletes.push(
            r2.send(
              new DeleteObjectCommand({
                Bucket: process.env.CLOUDFLARE_R2_AUDIO_BUCKET,
                Key: fullTrack.audioKey,
              }),
            ),
          );
        }
      } catch (err) {
        console.error("Error deleting audio from R2:", err);
        return res
          .status(500)
          .json({ error: "Failed to delete audio file with " + err.message });
      }

      if (fullTrack.imageKey) {
        const imageKey = fullTrack.imageKey.split(
          ".r2.cloudflarestorage.com/",
        )[1];

        if (imageKey) {
          try {
            deletes.push(
              r2.send(
                new DeleteObjectCommand({
                  Bucket: process.env.CLOUDFLARE_R2_IMAGES_BUCKET,
                  Key: imageKey,
                }),
              ),
            );
          } catch (err) {
            console.error("Error deleting image from R2:", err);
            return res.status(500).json({
              error: "Failed to delete image file with " + err.message,
            });
          }
        }
      }

      await Promise.all(deletes);
    }

    // ========================
    // DB DELETE LAST
    // ========================
    try {
      await prisma.track.delete({ where: { id } });
    } catch (err) {
      console.error("Error deleting track from DB:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete track with " + err.message });
    }

    return res.status(204).end();
  }

  res.status(405).end();
}
