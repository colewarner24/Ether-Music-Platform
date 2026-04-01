import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../lib/adminMiddleware';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'GET') {
    const tracks = await prisma.track.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(tracks);
  }

  if (req.method === 'PATCH') {
    const { id, data } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Track ID is required' });
    }

    // Only allow updating title and private status
    const updatable = {};
    if (data.title !== undefined) updatable.title = data.title;
    if (data.private !== undefined) updatable.private = data.private;

    const track = await prisma.track.update({
      where: { id: parseInt(id) },
      data: updatable,
      include: { user: true },
    });
    return res.status(200).json(track);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Track ID is required' });
    }

    const track = await prisma.track.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json({ message: 'Track deleted', track });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default async (req, res) => {
  return requireAdmin(req, res, handler);
};
