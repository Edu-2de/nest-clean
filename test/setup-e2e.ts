import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run e2e tests');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

const schemaId = randomUUID();
process.env.DATABASE_URL = generateUniqueDatabaseURL(schemaId);

const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL },
  { schema: schemaId },
);
const prisma = new PrismaClient({ adapter });

beforeAll(() => {
  execSync('pnpm prisma migrate deploy', { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
