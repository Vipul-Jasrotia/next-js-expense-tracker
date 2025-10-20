// lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export function getDb(): PrismaClient | null {
  // Skip DB during Vercel build
  if (process.env.VERCEL && process.env.VERCEL_ENV === 'preview') {
    return null;
  }

  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  return globalThis.prisma;
}
