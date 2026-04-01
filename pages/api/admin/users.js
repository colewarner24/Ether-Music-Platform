import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../lib/adminMiddleware';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      include: { tracks: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(users);
  }

  if (req.method === 'PATCH') {
    const { id, data } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Prevent changing email or artistName to duplicates
    const updatable = {};
    if (data.isAdmin !== undefined) updatable.isAdmin = data.isAdmin;
    if (data.profilePhoto !== undefined) updatable.profilePhoto = data.profilePhoto;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updatable,
      include: { tracks: true },
    });
    return res.status(200).json(user);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Delete associated tracks first
    await prisma.track.deleteMany({
      where: { userId: parseInt(id) },
    });

    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json({ message: 'User deleted', user });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default async (req, res) => {
  return requireAdmin(req, res, handler);
};
