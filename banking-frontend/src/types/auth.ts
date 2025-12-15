import { z } from 'zod';

// Zod Schemas: Used for Form Validation.

// 1. Schema for Register Form
export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

// 2. Schema for Login Form
export const LoginSchema = z.object({
  username: z.string().min(3, 'Username required.'),
  password: z.string().min(6, 'Password required.'),
});
export type LoginFormValues = z.infer<typeof LoginSchema>;

// Expected Response Types from Backend

// 3. When Register Process is Successful (RegisterResponseDto)
export interface RegisterResponse {
  id: string; // comes as UUID string
  username: string;
  email: string;
  createdAt: string; // comes as LocalDateTime string
  updatedAt: string;
}

// 4. When Login Process is Successful (LoginResponseDto)
export interface LoginResponse {
  token: string;
  userId: string;
}