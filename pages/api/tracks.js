import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const skip = parseInt(req.query.skip) || 0;
  const take = parseInt(req.query.take) || 10;

  const [tracks, total] = await Promise.all([
    prisma.track.findMany({
      where: { private: false },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.track.count({
      where: { private: false },
    }),
  ]);

  res.json({
    tracks,
    total,
    skip,
    take,
    hasMore: skip + take < total,
  });
}
