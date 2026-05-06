import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  isdCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const ssoSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  isdCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  company: z.object({
    name: z.string().optional(),
    url: z.string().optional(),
  }).optional(),
  socials: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

export const generateResetPasswordSchema = z.object({
  email: z.string().email('A valid email is required'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const deleteAccountSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});
