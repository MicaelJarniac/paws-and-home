import { z } from 'zod';

// CPF check-digit algorithm (Brazilian tax ID). Sequences of identical digits
// (e.g. "111.111.111-11") pass the math but are universally rejected as
// invalid CPFs by Brazilian government systems, so we reject them too.
const isValidCPF = (raw: string): boolean => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const compute = (slice: string, weightStart: number): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i]!, 10) * (weightStart - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  return (
    compute(digits.slice(0, 9), 10) === parseInt(digits[9]!, 10) &&
    compute(digits.slice(0, 10), 11) === parseInt(digits[10]!, 10)
  );
};

export const PET_TYPE_VALUES = ['dog', 'cat', 'rabbit', 'any'] as const;
export const HOME_TYPE_VALUES = [
  'house-yard',
  'house-no-yard',
  'apartment',
  'farm',
] as const;
export const EXPERIENCE_VALUES = ['first-time', 'some', 'experienced'] as const;
export const APPLICATION_STATUS_VALUES = [
  'pending',
  'reviewing',
  'approved',
  'rejected',
] as const;

export type PetType = (typeof PET_TYPE_VALUES)[number];
export type HomeType = (typeof HOME_TYPE_VALUES)[number];
export type Experience = (typeof EXPERIENCE_VALUES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUS_VALUES)[number];

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().max(max).optional(),
  );

export const applicationSchema = z.object({
  'full-name': z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(100, 'Full name must be 100 characters or fewer.'),
  email: z
    .string()
    .trim()
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address.',
    )
    .max(255, 'Email must be 255 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Please enter a valid phone number, e.g. (19) 99999-9999.',
    ),
  cpf: z
    .string()
    .trim()
    .refine(isValidCPF, 'Please enter a valid CPF (000.000.000-00).'),
  'pet-type': z.enum(PET_TYPE_VALUES, { message: 'Please select a pet type.' }),
  'pet-name': optionalTrimmedString(100),
  'home-type': z.enum(HOME_TYPE_VALUES, {
    message: 'Please select your home type.',
  }),
  experience: z.enum(EXPERIENCE_VALUES, {
    message: 'Please select your experience level.',
  }),
  notes: optionalTrimmedString(500),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// Maps schema field names to their <input id> in the EJS form. Names and IDs
// match except for `email` (input id is `adopt-email` to avoid colliding with
// the admin login form's `email` field).
export const APPLICATION_FIELD_INPUT_IDS: Record<string, string> = {
  'full-name': 'full-name',
  email: 'adopt-email',
  phone: 'phone',
  cpf: 'cpf',
  'pet-type': 'pet-type',
  'pet-name': 'pet-name',
  'home-type': 'home-type',
  experience: 'experience',
  notes: 'notes',
};
