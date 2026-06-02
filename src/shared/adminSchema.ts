import { z } from 'zod';

const usernameField = z
  .string()
  .trim()
  .min(2, 'Username must be at least 2 characters.')
  .max(50, 'Username must be 50 characters or fewer.')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username may only contain letters, numbers, underscore, and hyphen.',
  );

const emailField = z
  .string()
  .trim()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.')
  .max(255, 'Email must be 255 characters or fewer.');

const passwordField = z
  .string()
  .min(6, 'Password must be at least 6 characters.')
  .max(200, 'Password must be 200 characters or fewer.');

export const adminCreateSchema = z.object({
  username: usernameField,
  email: emailField,
  password: passwordField,
});

export const adminUpdateSchema = z.object({
  username: usernameField,
  email: emailField,
  password: z.preprocess(
    (v) => (typeof v === 'string' && v === '' ? undefined : v),
    passwordField.optional(),
  ),
});

export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>;
