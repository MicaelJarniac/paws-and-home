import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Please enter your username.')
    .max(100, 'Username must be 100 characters or fewer.'),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .max(200, 'Password must be 200 characters or fewer.'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
