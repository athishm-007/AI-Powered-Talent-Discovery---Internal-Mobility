import { z } from 'zod';

export const UserRoleSchema = z.enum(['employee', 'hr_admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role_title: z.string().optional().default('Team Member'),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const DemoLoginSchema = z.object({
  role: z.enum(['hr_admin', 'employee']),
  email: z.string().email(),
});
export type DemoLoginInput = z.infer<typeof DemoLoginSchema>;
