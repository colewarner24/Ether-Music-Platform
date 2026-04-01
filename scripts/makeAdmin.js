import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find the first user and make them admin
  const user = await prisma.user.findFirst();
  
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });
    console.log(`User ${user.email} is now an admin`);
  } else {
    console.log('No users found in database');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
