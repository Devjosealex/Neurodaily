import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get the current Clerk user ID (server-side)
 * Throws if not authenticated
 */
export async function getClerkUserId(): Promise<string> {
  const { userId } = auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}

/**
 * Get the Clerk session token for API requests (server-side)
 */
export async function getAuthToken(): Promise<string> {
  const { getToken } = auth();
  const token = await getToken();
  if (!token) {
    throw new Error('No auth token');
  }
  return token;
}

/**
 * Get full Clerk user object (server-side)
 */
export { currentUser };
