import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { DB_BASE64 } from './db-seed-data';

function setupDatabaseUrl(): string | undefined {
  if (typeof window !== 'undefined') return undefined;

  // On Vercel / AWS Lambda / Serverless
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    const tmpDbPath = path.join('/tmp', 'dev.db');

    let needsInit = false;
    try {
      if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
        needsInit = true;
      }
    } catch {
      needsInit = true;
    }

    if (needsInit) {
      let copied = false;
      const possibleSources = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ];

      for (const src of possibleSources) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath);
            copied = true;
            console.log(`Copied database from ${src} to ${tmpDbPath}`);
            break;
          } catch (e) {
            console.error(`Failed copying ${src} to ${tmpDbPath}:`, e);
          }
        }
      }

      if (!copied && DB_BASE64) {
        try {
          fs.writeFileSync(tmpDbPath, Buffer.from(DB_BASE64, 'base64'));
          console.log(`Initialized /tmp/dev.db from embedded base64 database buffer`);
        } catch (e) {
          console.error(`Failed writing base64 DB to ${tmpDbPath}:`, e);
        }
      }
    }

    const url = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = url;
    return url;
  }

  if (!process.env.DATABASE_URL) {
    const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const url = `file:${localDbPath}`;
    process.env.DATABASE_URL = url;
    return url;
  }

  return process.env.DATABASE_URL;
}

const dbUrl = setupDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
