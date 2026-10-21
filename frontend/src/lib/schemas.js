import { z } from 'zod';

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const isRealPastDate = (s) => {
  if (!s) return true; // optional
  const d = new Date(`${s}T00:00:00`);
  return !Number.isNaN(d.getTime()) && d <= new Date() && d.getFullYear() >= 1900;
};

const fullName = z
  .string()
  .trim()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must be 100 characters or fewer');

const username = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9_]{3,20}$/, 'Use 3–20 letters, numbers or underscores');

const email = z.string().trim().min(1, 'Enter your email address').email('Enter a valid email address');

const phone = z
  .string()
  .trim()
  .min(1, 'Enter your phone number')
  .refine((v) => {
    if (!/^\+?[0-9\s\-().]+$/.test(v)) return false;
    const digits = v.replace(/\D/g, '').length;
    return digits >= 7 && digits <= 15;
  }, 'Enter a valid phone number, e.g. +234 801 234 5678');

const dateOfBirth = z
  .string()
  .optional()
  .refine(isRealPastDate, 'Enter a real date that is not in the future');

const gender = z.enum(['', 'female', 'male', 'non_binary', 'prefer_not_to_say']).optional();

const password = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use 72 characters or fewer')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[0-9]/, 'Include a number');

export const registerSchema = z
  .object({
    fullName,
    username,
    email,
    phone,
    dateOfBirth,
    gender,
    password,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptedTerms: z.boolean().refine((v) => v === true, 'You must accept the terms to continue'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Enter your password'),
});

export const profileSchema = z.object({ fullName, phone, dateOfBirth, gender });
