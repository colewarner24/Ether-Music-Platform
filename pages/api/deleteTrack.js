export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { title, artist, imageUrl } = req.body;
  const track = await prisma.track.delete({
    where: { title, artist, imageUrl, userId },
  });

  res.json(track);
}
