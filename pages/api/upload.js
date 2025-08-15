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
    const options = { uploadDir: tmpDir, keepExtensions: true };
    const { files } = await parseForm(req, options);

    // formidable sometimes gives an array if multiple files
    let file = files.file;
    if (Array.isArray(file)) file = file[0];
    if (!file || !file.filepath) return res.status(400).json({ error: "no_file" });

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalFilename || file.newFilename) || "";
    const filename = unique + ext;
    const dest = path.join(uploadsDir, filename);

    try {
      await fs.promises.rename(file.filepath, dest);
    } catch (e) {
      await fs.promises.copyFile(file.filepath, dest);
      await fs.promises.unlink(file.filepath);
    }

    const track = await prisma.track.create({
      data: {
        originalName: file.originalFilename || "unknown",
        filename,
        mimetype: file.mimetype || "application/octet-stream",
        size: file.size || 0
      }
    });

    res.json(track);
  } catch (err) {
    console.error("upload error:", err);
    res.status(500).json({ error: "upload_failed", details: String(err) });
  }
}
