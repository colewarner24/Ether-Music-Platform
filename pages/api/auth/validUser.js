import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];

  let userId = null;

  try {
    userId = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }

  const { artistName } = req.body;
  let user = null;

  try {
    user = await prisma.user.findUnique({ where: { artistName } });
    if (!user) return res.status(404).json({ error: "User not found" });
  }
    catch (error) {
    return res.status(500).json({ error: "Database error" });
 }
 
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.id !== userId) {
    return res.status(200).json({ valid: false });
  }
  res.status(200).json({ valid: true });
}
