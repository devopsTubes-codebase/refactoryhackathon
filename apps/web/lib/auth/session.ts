import type { SessionIdentity } from '@codebase-wiki/api';
import { getServerSession } from 'next-auth';
import { authOptions } from './config';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function getRequiredSessionIdentity(): Promise<SessionIdentity> {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Missing or invalid session');
  }

  return {
    userId,
    email: session.user?.email,
    name: session.user?.name,
  };
}
