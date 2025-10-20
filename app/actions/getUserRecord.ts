'use server';

import { getDb } from '@/lib/db'; // Vercel-safe DB import
import { auth } from '@clerk/nextjs/server';

async function getUserRecord(): Promise<{
  record?: number;
  daysWithRecords?: number;
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
    });

    const record = records.reduce((sum, record) => sum + record.amount, 0);

    // Count the number of days with valid expense records
    const daysWithRecords = records.filter(
      (record) => record.amount > 0
    ).length;

    return { record, daysWithRecords };
  } catch (error) {
    console.error('Error fetching user record:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default getUserRecord;
