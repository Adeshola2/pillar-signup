import { z } from 'zod';
import { fullName, username, email, phone, dateOfBirth, gender, password } from './user.validators.js';

export const registerSchema = z
  .object({
    fullName,
    username,
    email,
    phone,
    dateOfBirth,
    gender,
    password,
    confirmPassword: z.string({ required_error: 'Confirm your password' }),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const loginSchema = z.object({
  identifier: z
    .string({ required_error: 'Enter your email or username' })
    .trim()
    .toLowerCase()
    .min(1, 'Enter your email or username'),
  password: z.string({ required_error: 'Enter your password' }).min(1, 'Enter your password'),
});
