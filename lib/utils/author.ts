/**
 * Utility for getting Author from environment variables
 * Used for mocking author information in server actions
 */

import type { Author } from '@/types/products';

/**
 * Validates if a string is a valid UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Gets Author object from environment variables
 * @returns Author object with id (required), name and email (optional)
 * @throws Error if AUTHOR_ID is not set or invalid UUID format
 */
export function getAuthorFromEnv(): Author {
  const authorId = process.env.AUTHOR_ID;
  const authorName = process.env.AUTHOR_NAME;
  const authorEmail = process.env.AUTHOR_EMAIL;

  if (!authorId) {
    throw new Error(
      'AUTHOR_ID is not defined in environment variables. Please set AUTHOR_ID in your .env.local file.'
    );
  }

  if (!isValidUUID(authorId)) {
    throw new Error(
      `AUTHOR_ID must be a valid UUID format. Current value: ${authorId}`
    );
  }

  const author: Author = {
    id: authorId,
  };

  if (authorName) {
    author.name = authorName;
  }

  if (authorEmail) {
    author.email = authorEmail;
  }

  return author;
}

