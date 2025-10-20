'use server';

import { getDb } from '@/lib/db'; // Vercel-safe DB import
import { auth } from '@clerk/nextjs/server';
import { Record } from '@/types/Record';

async function getRecords(): Promise<{
  records?: Record[];
  error?: string;
}> {
  const db = getDb();
  if (!db) {
    console.log('Skipping DB logic during Vercel build');
    return { error: 'Database not available during build' };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const records = await db.record.findMany({
      where: { userId },
      orderBy: {
        date: 'desc', // Sort by the `date` field in descending order
      },
      take: 10, // Limit the request to 10 records
    });

    return { records };
  } catch (error) {
    console.error('Error fetching records:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default getRecords;
