// scripts/seed-admin.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@kksempire.com';
  const name = 'Admin';
  const passwordHash = process.argv[2]; // pass hash as CLI arg

  if (!passwordHash) {
    console.error('Usage: node scripts/seed-admin.js <BCRYPT_HASH>');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists:', email);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', user.email, user.id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });