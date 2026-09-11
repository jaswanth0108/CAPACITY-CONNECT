import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function setupDatabaseUrl(): string | undefined {
  if (typeof window !== 'undefined') return undefined;

  // On Vercel or AWS Lambda, the root filesystem is read-only, so SQLite needs /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    if (!fs.existsSync(tmpDbPath)) {
      // Find source db file bundled with the deployment
      const possibleSources = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), '.next', 'server', 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ];

      for (const src of possibleSources) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath);
            console.log(`Successfully copied SQLite DB from ${src} to ${tmpDbPath}`);
            break;
          } catch (e) {
            console.error(`Failed copying DB from ${src} to ${tmpDbPath}:`, e);
          }
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
