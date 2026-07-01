import { DomainEvents } from '@/core/events/domain-events'
import { PrismaClient } from '@/generated/prisma/client'
import { envSchema } from '@/infra/env/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
import 'dotenv/config'
import Redis from 'ioredis'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run e2e tests')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()
process.env.DATABASE_URL = generateUniqueDatabaseURL(schemaId)

const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL },
  { schema: schemaId },
)

const env = envSchema.parse(process.env)

const prisma = new PrismaClient({ adapter })

const redis = new Redis({
  host: env.REDIS_HOST,
  db: env.REDIS_DB,
  port: env.REDIS_PORT,
})

beforeAll(async () => {
  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync('pnpm prisma migrate deploy', { stdio: 'pipe' })
}, 60000)

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
