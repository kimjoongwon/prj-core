'use server';

import { revalidatePath } from 'next/cache';

export async function createPost() {
  try {
    await fetch('http://localhost:3005/api/v1/admin/spaces');
  } catch (error) {}
  // Invalidate all data tagged with 'posts' in the cache
  revalidatePath('/api/v1/admin/spaces');
}
