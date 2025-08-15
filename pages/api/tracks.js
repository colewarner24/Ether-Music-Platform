import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const tracks = await prisma.track.findMany({ orderBy: { createdAt: "desc" } });
  res.json(tracks);
}
