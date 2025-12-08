import prisma from "@lib/prisma";
import {decodeToken} from "../utils";

export default async function handler(req, res) {

  let userId;
  try {
    userId = decodeToken(req);
  }
  catch (err) {
    return res.status(401).json({ error: err.message });
  }
  console.log("userId", userId);

  if (!userId) {
    return res.status(404).json({ error: "Artist not found" });
  }

  let tracks;
  try{
    tracks = await prisma.track.findMany({
    where: { userId: userId.id },
    orderBy: { createdAt: "desc" },
  });
  }catch (err) {
    return res.status(500).json({ error: "Database error: " + err.message });
  }
  res.json(tracks);
}
