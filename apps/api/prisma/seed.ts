import { createHash } from 'node:crypto';
import { prisma } from '../src/prisma.js';

const run = async () => {
  const email = process.env.SEED_USER_EMAIL ?? 'demo@reflecta.local';
  const name = process.env.SEED_USER_NAME ?? 'Demo User';
  const password = process.env.SEED_USER_PASSWORD ?? 'demo-password';
  const passwordHash = createHash('sha256').update(password).digest('hex');

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      password: passwordHash,
    },
  });

  console.log(`Seeded user: ${user.id} (${user.email})`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
