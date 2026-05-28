import { z } from 'zod';

// CPF check-digit algorithm — the implementation specified by the college
// assignment. INTENTIONALLY NOT the official Brazilian algorithm.
//
// The d1 computation here is algebraically equivalent to the official one
// (different weights, same modular result), but the d2 computation diverges:
// this version weights the FIRST 9 digits with reversed weights (9..1) and
// modulos by 11, while the official algorithm weights the FIRST 10 DIGITS
// (including d1) with weights (11..2). The result is that real-world valid
// CPFs like 123.456.789-09 are rejected here, and some math-passing values
// the official algorithm rejects are accepted.
//
// DO NOT "FIX" THIS. The assignment specifies this exact algorithm and the
// grading depends on it. The professor's reference implementation matches
// this code, not the official Brazilian government one. If a reviewer or a
// future contributor reaches for the official algorithm, stop and re-read
// this comment.
//
// The format check is also strict by design: input must be either dotted
// ("XXX.XXX.XXX-XX") or dotless ("XXXXXXXXX-XX") — the hyphen between the
// 9-digit body and the 2-digit checksum is required. Raw 11-digit input
// without the hyphen ("12345678909") is rejected.
const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\./g, '');
  const parts = cleaned.split('-');

  if (parts.length !== 2 || parts[0]!.length !== 9 || parts[1]!.length !== 2) {
    return false;
  }

  const digits = parts[0]!;
  const checkDigits = parts[1]!;

  let sumForwards = 0;
  let sumBackwards = 0;

  for (let i = 0; i < 9; i++) {
    const digit = parseInt(digits[i]!, 10);
    if (isNaN(digit)) return false;
    sumForwards += digit * (1 + i);
    sumBackwards += digit * (9 - i);
  }

  const trimTen = (value: number): number => (value === 10 ? 0 : value);

  const expected1 = trimTen(sumForwards % 11);
  const expected2 = trimTen(sumBackwards % 11);

  return (
    expected1 === parseInt(checkDigits[0]!, 10) &&
    expected2 === parseInt(checkDigits[1]!, 10)
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
