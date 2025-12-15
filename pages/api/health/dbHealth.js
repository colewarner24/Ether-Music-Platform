import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
        // Execute a simple query to check database connectivity
        console.log('Checking database connection...');
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok', message: 'Database connected successfully' });
      } catch (error) {
        console.error('Database health check failed:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
      }
      // } finally {
      //   await prisma.$disconnect(); // Disconnect Prisma client after the check
      // }
}
