import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyAdminToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isAdmin) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(req, res, handler) {
  const user = await verifyAdminToken(req);

  if (!user) {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }

  return handler(req, res);
}
