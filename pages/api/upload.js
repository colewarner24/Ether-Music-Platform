import prisma from "../../lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // 1. Verify the JWT from cookies or headers
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) return res.status(401).json({ error: "Invalid token" });

    // 2. Parse the form
    const form = formidable({ multiples: true, uploadDir: "./public/uploads", keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Error parsing form" });

      console.log("Parsed fields:", fields);
      let title = fields.title;
      if (Array.isArray(title)) title = title[0];
      const audio = files.file?.[0];
      const artwork = files.artwork?.[0];

      if (!audio) return res.status(400).json({ error: "No audio file uploaded" });

      const audioFilename = path.basename(audio.filepath);
      const artworkFilename = artwork ? path.basename(artwork.filepath) : null;

      console.log("artist name from token:", decoded.artistName);

      // 3. Create track with reference to userId
      const track = await prisma.track.create({
        data: {
          filename: audioFilename,
          mimetype: audio.mimetype || "application/octet-stream",
          size: audio.size || 0,
          title: title || audio.originalFilename || "Untitled",
          // artist: user.artistName, // optional: store artist name from JWT
          imageUrl: artworkFilename,
          userId: userId, // 👈 link track to the signed-in user
        },
      });

      return res.status(200).json(track);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed", details: error.message });
  }
}
