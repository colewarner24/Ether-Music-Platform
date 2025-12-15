import prisma from "@/lib/prisma";
export default async function handler(req, res) {
  const tracks = await prisma.track.findMany({ 
    where: { private: false },
    orderBy: { createdAt: "desc" } });
  res.json(tracks);
}
