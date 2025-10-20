import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Only create a PrismaClient instance when running on server (runtime), 
 * not during Vercel build or static generation.
 */
export function getPrismaClient(): PrismaClient | null {
  if (process.env.VERCEL && process.env.VERCEL_ENV === 'preview') {
    // During Vercel build, return null
    return null;
  }

  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  return globalThis.prisma;
}

