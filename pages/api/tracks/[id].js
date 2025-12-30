import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

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
    const { title, artist, imageUrl, private: isPrivate } = req.body;

    const updated = await prisma.track.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(artist !== undefined && { artist }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isPrivate !== undefined && { private: isPrivate }),
      },
    });

    return res.json(updated);
  }

  // ========================
  // DELETE TRACK
  // ========================
  if (req.method === "DELETE") {
    await prisma.track.delete({
      where: { id },
    });

    return res.status(204).end();
  }

  res.status(405).end();
}
