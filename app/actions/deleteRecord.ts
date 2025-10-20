'use server';

import { getDb } from '@/lib/db'; // Vercel-safe DB import
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function deleteRecord(recordId: string): Promise<{
  message?: string;
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
    await db.record.delete({
      where: {
        id: recordId,
        userId,
      },
    });

    revalidatePath('/');

    return { message: 'Record deleted' };
  } catch (error) {
    console.error('Error deleting record:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default deleteRecord;
