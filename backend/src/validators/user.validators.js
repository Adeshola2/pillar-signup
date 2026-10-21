import { z } from 'zod';

export const GENDERS = ['male', 'female', 'non_binary', 'prefer_not_to_say'];

const emptyToNull = (v) => (v === '' || v === null ? null : v);

export const fullName = z
  .string({ required_error: 'Enter your full name' })
  .trim()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must be 100 characters or fewer');

export const username = z
  .string({ required_error: 'Choose a username' })
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, 'Use 3–20 letters, numbers or underscores');

export const email = z
  .string({ required_error: 'Enter your email address' })
  .trim()
  .toLowerCase()
  .max(254, 'Email address is too long')
  .email('Enter a valid email address');

export const phone = z
  .string({ required_error: 'Enter your phone number' })
  .trim()
  .refine((v) => {
    if (!/^\+?[0-9\s\-().]+$/.test(v)) return false;
    const digits = v.replace(/\D/g, '').length;
    return digits >= 7 && digits <= 15;
  }, 'Enter a valid phone number, e.g. +234 801 234 5678');

const isRealPastDate = (s) => {
  const d = new Date(`${s}T00:00:00.000Z`);
  return (
    !Number.isNaN(d.getTime()) &&
    d.toISOString().slice(0, 10) === s &&
    d <= new Date() &&
    d.getUTCFullYear() >= 1900
  );
};

// undefined = not supplied, null/'' = cleared, string = new value
export const dateOfBirth = z.preprocess(
  emptyToNull,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD')
    .refine(isRealPastDate, 'Enter a real date that is not in the future')
    .nullable()
    .optional()
);

export const gender = z.preprocess(
  emptyToNull,
  z
    .enum(GENDERS, { errorMap: () => ({ message: 'Choose one of the listed options' }) })
    .nullable()
    .optional()
);

export const password = z
  .string({ required_error: 'Create a password' })
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use 72 characters or fewer')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[0-9]/, 'Include a number');

export const updateProfileSchema = z
  .object({ fullName: fullName.optional(), phone: phone.optional(), dateOfBirth, gender })
  .strict()
  .refine((d) => Object.keys(d).length > 0, { message: 'Nothing to update' });
