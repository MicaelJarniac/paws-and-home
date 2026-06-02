import { z } from 'zod';
import { APPLICATION_STATUS_VALUES } from './applicationSchema.js';

export const adminApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUS_VALUES, {
    message: 'Please select a valid status.',
  }),
});

export type AdminApplicationStatusInput = z.infer<
  typeof adminApplicationStatusSchema
>;
