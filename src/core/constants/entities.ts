export const FORBIDDEN_PUBLIC_FIELDS = ['password_hash', 'is_deleted'] as const;

export type ForbiddenFields = typeof FORBIDDEN_PUBLIC_FIELDS[number];