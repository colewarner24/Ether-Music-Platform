import prisma from "@lib/prisma";
import { decodeToken } from "@/lib/api-utils";

export default async function handler(req, res) {
  let userId;
  try {
    userId = decodeToken(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  if (!userId) {
    return res.status(404).json({ error: "Artist not found" });
  }

  let tracks;
  try {
    tracks = await prisma.track.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { artistName: true },
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Database error: " + err.message });
  }
  res.json(tracks);
}
