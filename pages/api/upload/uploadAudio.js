import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file;
    const key = `audio/${fields.userId}/${Date.now()}.wav`;

    const upload = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_AUDIO_BUCKET,
      Key: key,
      Body: file.filepath ? fs.createReadStream(file.filepath) : file,
      ContentType: file.mimetype,
    });

    await r2.send(upload);

    return res.status(200).json({ key });
  });
}
