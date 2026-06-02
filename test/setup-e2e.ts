import { PrismaClient } from '@/generated/prisma/client'; // Ajuste conforme o seu path
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

let prisma: PrismaClient;
let schemaId: string;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run e2e tests');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

beforeAll(async () => {
  schemaId = randomUUID();
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  const adapter = await new PrismaPg({ connectionString: databaseURL });
  prisma = await new PrismaClient({ adapter });

  execSync('npx prisma migrate dev');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

  await prisma.$disconnect();
});
