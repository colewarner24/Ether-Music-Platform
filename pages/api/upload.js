import formidable from "formidable";
import fs from "fs";
import path from "path";
import prisma from "../../lib/prisma";

export const config = { api: { bodyParser: false } };

function parseForm(req, options) {
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const { fields, files } = await parseForm(req, {
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB per file (adjust)
      multiples: true
    });

    // fields
    const title = (fields.title && String(Array.isArray(fields.title) ? fields.title[0] : fields.title).trim()) || "Untitled";
    const artist = (fields.artist && String(Array.isArray(fields.artist) ? fields.artist[0] : fields.artist).trim()) || "Unknown";

    // required audio file (field name: "file")
    let audio = files.file;
    if (Array.isArray(audio)) audio = audio[0];
    if (!audio || !audio.filepath) return res.status(400).json({ error: "no_audio_file" });

    // optional artwork (field name: "artwork")
    let artwork = files.artwork;
    if (Array.isArray(artwork)) artwork = artwork[0];

    // prepare dest dirs
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const artDir = path.join(process.cwd(), "public", "artworks");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(artDir)) fs.mkdirSync(artDir, { recursive: true });

    // move audio
    const uniqueAudio = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const audioExt = path.extname(audio.originalFilename || audio.newFilename) || "";
    const audioFilename = uniqueAudio + audioExt;
    const audioDest = path.join(uploadsDir, audioFilename);
    try {
      await fs.promises.rename(audio.filepath, audioDest);
    } catch {
      await fs.promises.copyFile(audio.filepath, audioDest);
      await fs.promises.unlink(audio.filepath);
    }

    // move artwork if present
    let artworkFilename = null;
    if (artwork && artwork.filepath) {
      const uniqueArt = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const artExt = path.extname(artwork.originalFilename || artwork.newFilename) || "";
      artworkFilename = uniqueArt + artExt;
      const artDest = path.join(artDir, artworkFilename);
      try {
        await fs.promises.rename(artwork.filepath, artDest);
      } catch {
        await fs.promises.copyFile(artwork.filepath, artDest);
        await fs.promises.unlink(artwork.filepath);
      }
    }

    const track = await prisma.track.create({
      data: {
        originalName: audio.originalFilename || "unknown",
        filename: audioFilename,
        mimetype: audio.mimetype || "application/octet-stream",
        size: audio.size || 0,
        title,
        artist,
        artworkFile: artworkFilename
      }
    });

    res.json(track);
  } catch (err) {
    console.error("upload error:", err);
    res.status(500).json({ error: "upload_failed", details: String(err) });
  }
}
