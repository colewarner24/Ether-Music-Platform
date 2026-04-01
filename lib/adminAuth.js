import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkAdminAccess(req) {
  try {
    // Try to get token from Authorization header (passed from client-side)
    // Note: getServerSideProps runs server-side, so we check cookie or custom header
    let token = null;
    
    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }
    
    // If not found in Authorization header, check cookies
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      const tokenCookie = cookies.find(c => c.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.substring(6);
      }
    }
    
    if (!token) {
      return null;
    }

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
