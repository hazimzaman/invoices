import { PostgrestError } from '@supabase/supabase-js';

export class APIError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleError = (error: unknown): never => {
  if (error instanceof APIError) {
    throw error;
  }

  if (typeof error === 'object' && error !== null) {
    const pgError = error as PostgrestError;
    if (pgError.code && pgError.message) {
      throw new APIError(pgError.message, pgError.code, pgError.details);
    }
  }

  throw new APIError(
    error instanceof Error ? error.message : 'An unexpected error occurred'
  );
};