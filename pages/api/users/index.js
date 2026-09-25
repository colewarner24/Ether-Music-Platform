import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { artistName: "asc" },
      select: {
        artistName: true,
        profilePhoto: true,
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Failed to load public users:", error);
    return res.status(500).json({ error: "Unable to load users" });
  }
}
