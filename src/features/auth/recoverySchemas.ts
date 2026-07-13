import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .max(320, 'El correo no puede superar 320 caracteres')
    .trim()
    .toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .length(6, 'El código debe tener 6 dígitos')
      .regex(/^\d{6}$/, 'El código solo puede contener números'),
    password: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .max(256, 'No puede superar 256 caracteres')
      .regex(/[A-Z]/, 'Debe contener una letra mayúscula')
      .regex(/\d/, 'Debe contener un número'),
    repeatPassword: z.string().min(1, 'Confirma la nueva contraseña'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
